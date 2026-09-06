import { GameState, PawnState, BoardPosition, PlayerState, findPawn } from './GameTypes';
import { isSafeAbsoluteIndex, absolutePathIndex } from './BoardLayout';

/**
 * The actual Ludo rules engine - built fresh for Phase 5, no Unity
 * equivalent exists (see GameTypes.ts). Used both by LocalGameTransport
 * (single-player/bot matches, fully authoritative locally) and, per the
 * port plan's client-authoritative-display / server-authoritative-state
 * model, by MatchScreenController for optimistic local prediction ahead of
 * the server's broadcast in networked matches - the server is expected to
 * run the equivalent logic itself and is the final word if the two ever
 * disagree.
 *
 * Standard ruleset implemented:
 *  - a pawn leaves its yard only on a roll of 6
 *  - 57 total steps from entry to finish (51 shared-path squares + 6 home-column squares)
 *  - landing exactly on an opponent's pawn on a non-safe square captures it (sends it back to yard)
 *  - rolling a 6, capturing a pawn, or getting a pawn to 'finished' grants an extra roll
 *  - a match is won when a player has all 4 pawns 'finished'
 *
 * Deliberately NOT implemented (documented simplification, not an oversight):
 *  - "three 6s in a row forfeits the turn" - a common but not universal
 *    house rule. Add it if product confirms it's wanted; it needs one more
 *    piece of per-turn state (a consecutive-six counter) that isn't part of
 *    GameState today since it's turn-transient, not something a
 *    reconnecting client needs to rehydrate.
 */

export function legalMovesForRoll(state: GameState, diceValue: number): number[] {
    const seat = state.turn.currentPlayerSeat;
    const legal: number[] = [];
    for (let pawnIndex = 0; pawnIndex < 4; pawnIndex++) {
        const pawn = findPawn(state, seat, pawnIndex);
        if (canMove(pawn, diceValue)) {
            legal.push(pawnIndex);
        }
    }
    return legal;
}

function canMove(pawn: PawnState, diceValue: number): boolean {
    if (pawn.position.lane === 'finished') {
        return false;
    }
    if (pawn.position.lane === 'yard') {
        return diceValue === 6;
    }
    const total = totalStepsOf(pawn.position) + diceValue;
    return total <= 57;
}

function totalStepsOf(position: BoardPosition): number {
    switch (position.lane) {
        case 'yard':
            return -1; // not yet entered
        case 'path':
            return position.step;
        case 'home':
            return 51 + position.step;
        case 'finished':
            return 57;
    }
}

function positionFromTotalSteps(total: number): BoardPosition {
    if (total === 57) return { lane: 'finished' };
    if (total >= 51) return { lane: 'home', step: total - 51 };
    return { lane: 'path', step: total };
}

export interface MoveResult {
    state: GameState;
    capturedPawn: PawnState | null;
    pawnFinished: boolean;
    wonGame: boolean;
    bonusTurn: boolean;
}

/** Pure - returns a new GameState, does not mutate the one passed in. */
export function applyMove(state: GameState, pawnIndex: number, diceValue: number): MoveResult {
    const seat = state.turn.currentPlayerSeat;
    const player = state.players.find((p) => p.seat === seat)!;
    const pawn = findPawn(state, seat, pawnIndex);

    if (!canMove(pawn, diceValue)) {
        throw new Error(`Illegal move: seat ${seat} pawnIndex ${pawnIndex} with dice ${diceValue}`);
    }

    const fromTotal = pawn.position.lane === 'yard' ? -1 : totalStepsOf(pawn.position);
    const toTotal = fromTotal === -1 ? 0 : fromTotal + diceValue;
    const newPosition = positionFromTotalSteps(toTotal);

    let capturedPawn: PawnState | null = null;
    if (newPosition.lane === 'path') {
        const absoluteIndex = absolutePathIndex(player.color, newPosition.step);
        if (!isSafeAbsoluteIndex(absoluteIndex)) {
            capturedPawn = findOpponentPawnAt(state, player, absoluteIndex);
        }
    }

    const pawns = state.pawns.map((p) => {
        if (p.playerSeat === seat && p.pawnIndex === pawnIndex) {
            return { ...p, position: newPosition };
        }
        if (capturedPawn && p.playerSeat === capturedPawn.playerSeat && p.pawnIndex === capturedPawn.pawnIndex) {
            return { ...p, position: { lane: 'yard' } as BoardPosition };
        }
        return p;
    });

    const pawnFinished = newPosition.lane === 'finished';
    const wonGame = pawnFinished && pawns.filter((p) => p.playerSeat === seat && p.position.lane === 'finished').length === 4;
    const bonusTurn = diceValue === 6 || capturedPawn !== null || pawnFinished;

    const newState: GameState = {
        ...state,
        pawns,
        winnerSeat: wonGame ? seat : state.winnerSeat,
    };

    return { state: newState, capturedPawn, pawnFinished, wonGame, bonusTurn };
}

function findOpponentPawnAt(state: GameState, movingPlayer: PlayerState, absoluteIndex: number): PawnState | null {
    for (const pawn of state.pawns) {
        if (pawn.playerSeat === movingPlayer.seat || pawn.position.lane !== 'path') {
            continue;
        }
        const owner = state.players.find((p) => p.seat === pawn.playerSeat)!;
        if (absolutePathIndex(owner.color, pawn.position.step) === absoluteIndex) {
            return pawn;
        }
    }
    return null;
}

/** Seat that should play next, given the current seat and whether it earned a bonus turn. */
export function nextSeat(state: GameState, bonusTurn: boolean): number {
    if (bonusTurn) {
        return state.turn.currentPlayerSeat;
    }
    const seats = state.players.map((p) => p.seat).sort((a, b) => a - b);
    const currentIndex = seats.indexOf(state.turn.currentPlayerSeat);
    return seats[(currentIndex + 1) % seats.length];
}
