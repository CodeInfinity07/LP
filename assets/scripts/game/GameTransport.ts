import { GameState } from './GameTypes';

/**
 * Abstraction the turn engine talks to, so the same rules/rendering code
 * works for both a networked match (NetworkGameTransport, talking to the
 * backend over SocketService) and a local single-player/bot match
 * (LocalGameTransport, running LudoRules synchronously with no network at
 * all) - per the port plan's note that SingleMatchesController.cs suggests
 * a local mode exists in the lobby, even though (like everything else in
 * Phase 5) no implementation of it exists anywhere in the Unity source.
 */

export type GameTransportEvent =
    | { type: 'state_snapshot'; state: GameState }
    | { type: 'dice_rolled'; seat: number; value: number }
    | { type: 'pawn_moved'; state: GameState }
    | { type: 'turn_changed'; seat: number }
    | { type: 'match_ended'; winnerSeat: number };

export interface GameTransport {
    rollDice(): void;
    movePawn(pawnIndex: number): void;
    onEvent(callback: (event: GameTransportEvent) => void): () => void;
    /** Full-state resync - critical for reconnect-mid-match on the networked transport; a no-op on the local one, since there's nothing to lose a connection to. */
    requestGameState(): void;
}
