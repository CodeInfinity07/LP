/**
 * Phase 5 - built fresh, no Unity equivalent exists anywhere in the source
 * (see the port plan: GameMode4PlayerScene.unity exists but was never wired
 * to any state, and SocketManager.RequestGameState() is an unimplemented
 * stub). This is the client-side mirror of server-authoritative match
 * state described in the plan.
 */

export type PawnColor = 'red' | 'green' | 'yellow' | 'blue';

export const PLAYER_COLORS: PawnColor[] = ['red', 'green', 'yellow', 'blue'];

/**
 * A pawn's position, relative to its own color's start square:
 *  - 'yard'            : not yet on the board
 *  - { lane: 'path', step: 0-50 }   : on the shared 52-cell loop, step 0 is
 *                                     this color's own entry square
 *  - { lane: 'home', step: 0-5 }    : in this color's private 6-cell home
 *                                     column, step 5 is one square before finished
 *  - 'finished'         : reached the center, done for the match
 */
export type BoardPosition =
    | { lane: 'yard' }
    | { lane: 'path'; step: number }
    | { lane: 'home'; step: number }
    | { lane: 'finished' };

export interface PawnState {
    playerSeat: number;
    pawnIndex: 0 | 1 | 2 | 3;
    position: BoardPosition;
}

export interface PlayerState {
    seat: number;
    userId: string;
    color: PawnColor;
    isBot?: boolean;
}

export type TurnPhase = 'awaiting_roll' | 'awaiting_move' | 'resolving' | 'turn_end';

export interface TurnState {
    currentPlayerSeat: number;
    diceValue: number | null;
    phase: TurnPhase;
    /** pawnIndexes the current player may legally move with the current diceValue - empty until phase is 'awaiting_move'. */
    movablePawns: number[];
}

export interface GameState {
    matchId: string;
    players: PlayerState[];
    pawns: PawnState[];
    turn: TurnState;
    winnerSeat: number | null;
}

export function findPawn(state: GameState, seat: number, pawnIndex: number): PawnState {
    const pawn = state.pawns.find((p) => p.playerSeat === seat && p.pawnIndex === pawnIndex);
    if (!pawn) {
        throw new Error(`No pawn found for seat ${seat} pawnIndex ${pawnIndex}`);
    }
    return pawn;
}

export function playerBySeat(state: GameState, seat: number): PlayerState {
    const player = state.players.find((p) => p.seat === seat);
    if (!player) {
        throw new Error(`No player found for seat ${seat}`);
    }
    return player;
}
