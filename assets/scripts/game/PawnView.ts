import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { GridCoord } from './BoardLayout';

const { ccclass, property } = _decorator;

/**
 * Renders one pawn's position, animated from a data diff rather than
 * teleported - per the port plan's Phase 5 rendering architecture. Knows
 * nothing about game rules; MatchScreenController computes *what* changed
 * (BoardLayout.gridCoordFor per pawn, before/after a state update) and this
 * class only knows *how* to visually get there.
 */
@ccclass('PawnView')
export class PawnView extends Component {
    private static readonly BOARD_ORIGIN_OFFSET = 7; // center of the 15x15 grid, see BoardLayout.ts

    @property
    seat = 0;

    @property
    pawnIndex = 0;

    private clickHandler: ((seat: number, pawnIndex: number) => void) | null = null;

    onLoad(): void {
        this.node.on(Node.EventType.TOUCH_END, () => this.clickHandler?.(this.seat, this.pawnIndex));
    }

    setClickHandler(handler: (seat: number, pawnIndex: number) => void): void {
        this.clickHandler = handler;
    }

    moveTo(coord: GridCoord, cellSize: number, animate: boolean): void {
        const target = new Vec3(
            (coord.col - PawnView.BOARD_ORIGIN_OFFSET) * cellSize,
            -(coord.row - PawnView.BOARD_ORIGIN_OFFSET) * cellSize, // Cocos Y is up, board rows go down
            0
        );

        if (!animate) {
            this.node.setPosition(target);
            return;
        }

        tween(this.node).to(0.25, { position: target }, { easing: 'quadOut' }).start();
    }
}
