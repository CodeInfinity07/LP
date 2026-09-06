import { _decorator, Component, Label, tween, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

/**
 * Dice animation, decoupled from the turn state machine per the port plan:
 * MatchScreenController tells this "you're rolling" then "you landed on N",
 * this class only knows how to animate that, nothing about whose turn it is
 * or what the value means for pawn movement.
 *
 * No dice sprite/face art exists (nothing to port - see GameTypes.ts), so
 * this shows the numeric value on a Label with a spin+settle animation
 * rather than swapping sprite frames. Swap for real face art once it
 * exists; MatchScreenController's calls into this component don't need to
 * change either way.
 */
@ccclass('DiceView')
export class DiceView extends Component {
    @property(Label)
    valueLabel: Label | null = null;

    private rolling = false;

    startRolling(): void {
        this.rolling = true;
        if (this.valueLabel) this.valueLabel.string = '';
        this.spinStep();
    }

    private spinStep(): void {
        if (!this.rolling) return;
        tween(this.node)
            .to(0.08, { eulerAngles: new Vec3(0, 0, this.node.eulerAngles.z - 90) })
            .call(() => this.spinStep())
            .start();
    }

    settleOn(value: number): void {
        this.rolling = false;
        tween(this.node).stop();
        if (this.valueLabel) this.valueLabel.string = String(value);
        tween(this.node)
            .to(0.15, { scale: new Vec3(1.2, 1.2, 1) })
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .start();
    }
}
