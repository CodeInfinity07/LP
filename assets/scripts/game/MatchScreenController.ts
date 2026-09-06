import { _decorator, Label, Node } from 'cc';
import { ScreenController } from '../core/ScreenController';
import { NavigationManager } from '../core/NavigationManager';
import { GameState, PawnColor, findPawn, playerBySeat } from './GameTypes';
import { GameTransport, GameTransportEvent } from './GameTransport';
import { LocalGameTransport } from './LocalGameTransport';
import { NetworkGameTransport } from './NetworkGameTransport';
import { PawnView } from './PawnView';
import { DiceView } from './DiceView';
import { gridCoordFor } from './BoardLayout';
import { applyMove } from './LudoRules';

const { ccclass, property } = _decorator;

export interface MatchParams {
    matchId: string;
    mode: 'network' | 'local';
    /** Which seat this client's own player occupies - only that seat's roll/move input is accepted locally. */
    localSeat: number;
    /** 'local' mode only - who's sitting where, see GameFactory.createInitialGameState. */
    localPlayers?: Array<{ seat: number; userId: string; color: PawnColor; isBot?: boolean }>;
}

/**
 * The ScreenId.Match screen - ties together GameTransport (network or
 * local), LudoRules (for optimistic prediction), BoardLayout (positions),
 * and PawnView/DiceView (animation). Per the port plan's Phase 5 model:
 * this screen never treats its own guess as final truth for a networked
 * match - every transport event's state is what actually gets kept, an
 * optimistic move is just what's shown in the gap before that event arrives.
 */
@ccclass('MatchScreenController')
export class MatchScreenController extends ScreenController<MatchParams> {
    @property([PawnView])
    pawnViews: PawnView[] = [];

    @property(DiceView)
    diceView: DiceView | null = null;

    @property(Node)
    rollButton: Node | null = null;

    @property(Label)
    turnLabel: Label | null = null;

    @property(Label)
    winnerLabel: Label | null = null;

    @property
    cellSize = 40;

    private transport: GameTransport | null = null;
    private unsubscribeTransport: (() => void) | null = null;
    private currentState: GameState | null = null;
    private localSeat = 0;

    onEnter(params: MatchParams): void {
        this.localSeat = params.localSeat;

        this.transport =
            params.mode === 'local'
                ? new LocalGameTransport(params.matchId, params.localPlayers ?? [])
                : new NetworkGameTransport(params.matchId);

        this.unsubscribeTransport = this.transport.onEvent((event) => this.handleEvent(event));

        for (const pawnView of this.pawnViews) {
            pawnView.setClickHandler((seat, pawnIndex) => this.onPawnClicked(seat, pawnIndex));
        }
    }

    onExit(): void {
        this.unsubscribeTransport?.();
        this.unsubscribeTransport = null;
        if (this.transport && 'dispose' in this.transport) {
            (this.transport as NetworkGameTransport).dispose();
        }
        this.transport = null;
    }

    onRollBtn(): void {
        if (!this.currentState || this.currentState.turn.currentPlayerSeat !== this.localSeat) {
            return;
        }
        if (this.currentState.turn.phase !== 'awaiting_roll') {
            return;
        }
        this.diceView?.startRolling();
        this.transport?.rollDice();
    }

    onExitMatchBtn(): void {
        NavigationManager.instance.pop();
    }

    private onPawnClicked(seat: number, pawnIndex: number): void {
        if (!this.currentState || !this.transport) return;
        const { turn } = this.currentState;
        if (seat !== this.localSeat || turn.currentPlayerSeat !== this.localSeat) return;
        if (turn.phase !== 'awaiting_move' || !turn.movablePawns.includes(pawnIndex)) return;

        // Optimistic local prediction ahead of the transport's own event -
        // for LocalGameTransport this matches the authoritative result
        // exactly (it's the same rules engine); for NetworkGameTransport
        // this is a genuine guess that gets corrected/confirmed once the
        // server's pawn_moved broadcast arrives via handleEvent().
        const predicted = applyMove(this.currentState, pawnIndex, turn.diceValue!);
        this.render(predicted.state, true);

        this.transport.movePawn(pawnIndex);
    }

    private handleEvent(event: GameTransportEvent): void {
        switch (event.type) {
            case 'state_snapshot':
                this.currentState = event.state;
                this.render(event.state, false);
                break;
            case 'dice_rolled':
                this.diceView?.settleOn(event.value);
                break;
            case 'pawn_moved':
                this.render(event.state, true);
                break;
            case 'turn_changed':
                if (this.currentState) {
                    this.currentState = { ...this.currentState, turn: { ...this.currentState.turn, currentPlayerSeat: event.seat, diceValue: null, phase: 'awaiting_roll', movablePawns: [] } };
                }
                this.updateTurnUI();
                break;
            case 'match_ended':
                this.showWinner(event.winnerSeat);
                break;
        }
    }

    private render(state: GameState, animate: boolean): void {
        this.currentState = state;

        for (const pawnView of this.pawnViews) {
            const pawn = findPawn(state, pawnView.seat, pawnView.pawnIndex);
            const player = playerBySeat(state, pawnView.seat);
            const coord = gridCoordFor(player.color, pawnView.pawnIndex, pawn.position);
            pawnView.moveTo(coord, this.cellSize, animate);
        }

        this.updateTurnUI();
    }

    private updateTurnUI(): void {
        if (!this.currentState) return;
        const { turn } = this.currentState;
        const isMyTurn = turn.currentPlayerSeat === this.localSeat;

        if (this.rollButton) {
            this.rollButton.active = isMyTurn && turn.phase === 'awaiting_roll';
        }
        if (this.turnLabel) {
            const player = playerBySeat(this.currentState, turn.currentPlayerSeat);
            this.turnLabel.string = isMyTurn ? 'Your turn' : `${player.color}'s turn`;
        }
    }

    private showWinner(winnerSeat: number): void {
        if (this.rollButton) this.rollButton.active = false;
        if (this.winnerLabel && this.currentState) {
            const player = playerBySeat(this.currentState, winnerSeat);
            this.winnerLabel.node.active = true;
            this.winnerLabel.string = winnerSeat === this.localSeat ? 'You won!' : `${player.color} wins`;
        }
    }
}
