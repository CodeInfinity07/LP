import { GameState } from './GameTypes';
import { GameTransport, GameTransportEvent } from './GameTransport';
import { SocketService } from '../core/SocketService';

/**
 * Networked implementation of GameTransport, per the port plan's Phase 5
 * client-authoritative-display / server-authoritative-state model: this
 * class never computes game rules itself, it only sends intent
 * (rollDice/movePawn) and relays whatever the server broadcasts back.
 * MatchScreenController is responsible for any optimistic local prediction
 * ahead of these events - this class does not do that itself, it's a thin
 * relay.
 *
 * NONE of the wire events used here exist on the backend yet - see the
 * matching comment in SocketService.ts. This is the proposed protocol from
 * the port plan, unimplemented and untested against a real server (which is
 * currently offline anyway).
 */
export class NetworkGameTransport implements GameTransport {
    private listeners = new Set<(event: GameTransportEvent) => void>();
    private unsubscribers: Array<() => void> = [];

    constructor(matchId: string) {
        this.unsubscribers.push(
            SocketService.onGameEvent('match_joined', (payload) => this.emit({ type: 'state_snapshot', state: payload as GameState })),
            SocketService.onGameEvent('game_state_snapshot', (payload) => this.emit({ type: 'state_snapshot', state: payload as GameState })),
            SocketService.onGameEvent('dice_rolled', (payload) => {
                const p = payload as { seat: number; value: number };
                this.emit({ type: 'dice_rolled', seat: p.seat, value: p.value });
            }),
            SocketService.onGameEvent('pawn_moved', (payload) => this.emit({ type: 'pawn_moved', state: payload as GameState })),
            SocketService.onGameEvent('turn_changed', (payload) => this.emit({ type: 'turn_changed', seat: (payload as { seat: number }).seat })),
            SocketService.onGameEvent('match_ended', (payload) => this.emit({ type: 'match_ended', winnerSeat: (payload as { winnerSeat: number }).winnerSeat }))
        );

        SocketService.joinMatch(matchId);
    }

    onEvent(callback: (event: GameTransportEvent) => void): () => void {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    rollDice(): void {
        SocketService.emitRollDice();
    }

    movePawn(pawnIndex: number): void {
        SocketService.emitMovePawn(pawnIndex);
    }

    /** Critical for reconnect-mid-match: call this after SocketService reconnects to rehydrate full state instead of trying to replay missed deltas. */
    requestGameState(): void {
        SocketService.requestGameState();
    }

    dispose(): void {
        for (const unsubscribe of this.unsubscribers) unsubscribe();
        this.unsubscribers = [];
        this.listeners.clear();
    }

    private emit(event: GameTransportEvent): void {
        for (const listener of this.listeners) listener(event);
    }
}
