import { GameState, PawnColor } from './GameTypes';
import { GameTransport, GameTransportEvent } from './GameTransport';
import { legalMovesForRoll, applyMove, nextSeat } from './LudoRules';
import { createInitialGameState } from './GameFactory';

/**
 * Runs the full turn state machine synchronously, locally, with no network
 * involvement at all - for single-player/bot matches (see the port plan's
 * note on SingleMatchesController.cs). Bot seats play automatically: roll,
 * then move the first legal pawn (or moot - see pickBotPawn below), on a
 * short delay so it doesn't feel instant.
 */
export class LocalGameTransport implements GameTransport {
    private state: GameState;
    private listeners = new Set<(event: GameTransportEvent) => void>();
    private botTimer: ReturnType<typeof setTimeout> | null = null;

    constructor(matchId: string, players: Array<{ seat: number; userId: string; color: PawnColor; isBot?: boolean }>) {
        this.state = createInitialGameState(matchId, players);
        this.scheduleBotTurnIfNeeded();
    }

    onEvent(callback: (event: GameTransportEvent) => void): () => void {
        this.listeners.add(callback);
        callback({ type: 'state_snapshot', state: this.state });
        return () => this.listeners.delete(callback);
    }

    requestGameState(): void {
        this.emit({ type: 'state_snapshot', state: this.state });
    }

    rollDice(): void {
        if (this.state.turn.phase !== 'awaiting_roll') {
            return;
        }
        const diceValue = 1 + Math.floor(Math.random() * 6);
        const movablePawns = legalMovesForRoll(this.state, diceValue);
        const seat = this.state.turn.currentPlayerSeat;

        this.state = {
            ...this.state,
            turn: { ...this.state.turn, diceValue, movablePawns, phase: movablePawns.length > 0 ? 'awaiting_move' : 'turn_end' },
        };
        this.emit({ type: 'dice_rolled', seat, value: diceValue });

        if (movablePawns.length === 0) {
            this.endTurn(false);
        } else {
            this.scheduleBotTurnIfNeeded();
        }
    }

    movePawn(pawnIndex: number): void {
        if (this.state.turn.phase !== 'awaiting_move' || !this.state.turn.movablePawns.includes(pawnIndex)) {
            return;
        }
        const diceValue = this.state.turn.diceValue!;
        const result = applyMove(this.state, pawnIndex, diceValue);
        this.state = result.state;
        this.emit({ type: 'pawn_moved', state: this.state });

        if (result.wonGame) {
            this.emit({ type: 'match_ended', winnerSeat: this.state.turn.currentPlayerSeat });
            return;
        }
        this.endTurn(result.bonusTurn);
    }

    private endTurn(bonusTurn: boolean): void {
        const seat = nextSeat(this.state, bonusTurn);
        this.state = { ...this.state, turn: { currentPlayerSeat: seat, diceValue: null, phase: 'awaiting_roll', movablePawns: [] } };
        this.emit({ type: 'turn_changed', seat });
        this.scheduleBotTurnIfNeeded();
    }

    private scheduleBotTurnIfNeeded(): void {
        const player = this.state.players.find((p) => p.seat === this.state.turn.currentPlayerSeat);
        if (!player?.isBot) {
            return;
        }
        if (this.botTimer) clearTimeout(this.botTimer);
        this.botTimer = setTimeout(() => {
            if (this.state.turn.phase === 'awaiting_roll') {
                this.rollDice();
            } else if (this.state.turn.phase === 'awaiting_move') {
                this.movePawn(pickBotPawn(this.state.turn.movablePawns));
            }
        }, 700);
    }

    private emit(event: GameTransportEvent): void {
        for (const listener of this.listeners) listener(event);
    }
}

/** Simplest reasonable bot heuristic: prefer a pawn that's already on the board over bringing a new one out, otherwise first legal option. Not a "smart" AI - good enough to exercise the turn engine. */
function pickBotPawn(movablePawns: number[]): number {
    return movablePawns[0];
}
