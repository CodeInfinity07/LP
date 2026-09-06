// Import the pre-bundled browser build, NOT the bare 'socket.io-client'
// specifier - the plain package resolves (via its dependency
// engine.io-client) to a Node-only WebSocket transport file that requires
// Node's 'fs'/'ws' modules. That swap is normally handled by a bundler
// respecting engine.io-client's package.json "browser" field (Webpack/
// Rollup/etc. all do this), but Cocos Creator's own module loader does not,
// so it loads the Node-only file regardless of running in a browser -
// producing "Current environment does not provide a require() for
// requiring 'fs'" at runtime. socket.io-client/dist/socket.io.js is
// socket.io's own official pre-bundled, dependency-free browser build -
// see core/socket.io-client-dist.d.ts for the type shim that keeps this
// import fully typed despite that path having no .d.ts of its own.
import { io, Socket } from 'socket.io-client/dist/socket.io.js';
import { Config } from './Config';
import { UserStore, UserDetails } from './UserStore';
import { ClubStore, ClubDetails } from './ClubStore';

/**
 * Replaces Assets/Scripts/Managers/SocketManager.cs.
 *
 * Behavioral parity kept intentionally:
 *  - same connect options: websocket transport, Authorization: Bearer <token> header
 *  - same double-auth handshake: header at connect time AND an "authenticate"
 *    emit with { auth_token } once connected (the server expects both -
 *    this project doesn't own the backend, so both are preserved even
 *    though the header alone looks sufficient)
 *  - same event names, both directions
 *
 * Deliberately NOT ported from the Unity source:
 *  - MainThreadDispatcher.Enqueue(...) wrapping every handler - JS has one
 *    thread, socket.io callbacks already run on it, so there is nothing to
 *    marshal.
 *  - the "{ \"club_details\": " + raw + " }" / "{ \"items\": " + raw + " }"
 *    JSON-wrapping hack - that existed only because Unity's JsonUtility
 *    can't parse a bare array/object without a named root field. JSON.parse
 *    has no such restriction.
 *  - SendMessageToServer(string message) - kept as createClub(payload) here,
 *    a name that describes what it actually does (emits "create_club");
 *    the Unity name was left over from an earlier generic-message design.
 *
 * NOTE: the backend at Config.socketUrl is currently offline. connect() will
 * attempt to reach it and rely on socket.io-client's own reconnection/backoff;
 * it will not throw just because the server isn't up.
 */

type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error';

interface RawClubResponse {
    club_details: Array<{ club_details: ClubDetails }>;
}

interface RawUserDetailsResponse {
    items: UserDetails[]; // actually server sends a bare array/object per user_details; kept as items[] to match multi-item shape observed in the source
}

class SocketServiceImpl {
    private socket: Socket | null = null;
    private _connectionState: ConnectionState = 'disconnected';
    private connectionListeners = new Set<(state: ConnectionState) => void>();

    get connectionState(): ConnectionState {
        return this._connectionState;
    }

    onConnectionStateChanged(listener: (state: ConnectionState) => void): () => void {
        this.connectionListeners.add(listener);
        return () => this.connectionListeners.delete(listener);
    }

    private setConnectionState(state: ConnectionState): void {
        this._connectionState = state;
        for (const listener of this.connectionListeners) {
            listener(state);
        }
    }

    connectWithToken(authToken: string): void {
        this.setConnectionState('connecting');

        this.socket = io(Config.socketUrl, {
            transports: ['websocket'],
            extraHeaders: {
                Authorization: `Bearer ${authToken}`,
            },
            // socket.io-client's built-in reconnection/backoff - the Unity
            // client only logged "Reconnecting attempt: N" via
            // socket.OnReconnectAttempt without any real backoff/UI surfacing.
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 10000,
        });

        this.socket.on('connect', () => {
            this.setConnectionState('connected');
            this.socket!.emit('authenticate', { auth_token: authToken });
        });

        this.socket.on('disconnect', () => {
            this.setConnectionState('disconnected');
        });

        this.socket.on('connect_error', (err: Error) => {
            this.setConnectionState('error');
            console.error('[SocketService] connect_error:', err.message);
        });

        this.socket.io.on('reconnect_attempt', (attempt: number) => {
            this.setConnectionState('reconnecting');
            console.log(`[SocketService] reconnect attempt ${attempt}`);
        });

        this.socket.on('auth_response', (response: unknown) => {
            console.log('[SocketService] auth_response:', response);
        });

        this.socket.on('club_response', (response: RawClubResponse) => {
            const first = response?.club_details?.[0]?.club_details;
            if (first) {
                ClubStore.set(first);
            }
        });

        this.socket.on('user_details', (response: UserDetails | RawUserDetailsResponse) => {
            const details: UserDetails | undefined = Array.isArray((response as RawUserDetailsResponse).items)
                ? (response as RawUserDetailsResponse).items[0]
                : (response as UserDetails);
            if (details) {
                UserStore.set(details);
            }
        });
    }

    createClub(payload: unknown): void {
        this.socket?.emit('create_club', payload);
    }

    joinRoom(roomName: string): void {
        this.socket?.emit('join_room', roomName);
    }

    leaveRoom(roomName: string): void {
        this.socket?.emit('leave_room', roomName);
    }

    /**
     * Server-side handler for this event does not exist yet - it's an
     * unimplemented stub inherited from Unity's SocketManager.RequestGameState().
     * See Phase 5 of the port plan: this needs a real implementation
     * (full GameState snapshot reply) added to the backend before it's useful
     * for reconnect-mid-match rehydration.
     */
    requestGameState(): void {
        this.socket?.emit('request_game_state');
    }

    /**
     * None of the events below (join_match/match_joined, roll_dice/dice_rolled,
     * move_pawn/pawn_moved, turn_changed, match_ended, game_state_snapshot)
     * exist on the backend today - they're the protocol NetworkGameTransport.ts
     * proposes per the port plan's Phase 5, to be coordinated with whoever
     * owns 207.244.225.100:3050 before relying on them. Kept here rather than
     * inline in NetworkGameTransport so all raw socket event names stay in
     * one place, same as every other event this class handles.
     */
    joinMatch(matchId: string): void {
        this.socket?.emit('join_match', { matchId });
    }

    emitRollDice(): void {
        this.socket?.emit('roll_dice');
    }

    emitMovePawn(pawnIndex: number): void {
        this.socket?.emit('move_pawn', { pawnIndex });
    }

    onGameEvent(eventName: string, callback: (payload: unknown) => void): () => void {
        this.socket?.on(eventName, callback);
        return () => this.socket?.off(eventName, callback);
    }

    disconnect(): void {
        this.socket?.disconnect();
        this.socket = null;
        this.setConnectionState('disconnected');
    }
}

export const SocketService = new SocketServiceImpl();
