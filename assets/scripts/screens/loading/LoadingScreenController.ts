import { _decorator, Node } from 'cc';
import { ScreenController } from '../../core/ScreenController';

const { ccclass, property } = _decorator;

/** Replaces Assets/Scripts/Controllers/LoadingController.cs (spins a background sprite at rotateSpeed deg/sec). */
@ccclass('LoadingScreenController')
export class LoadingScreenController extends ScreenController<void> {
    @property(Node) loaderRotateBG: Node | null = null;
    @property rotateSpeed = 0;

    update(deltaTime: number): void {
        if (this.loaderRotateBG) {
            this.loaderRotateBG.angle -= this.rotateSpeed * deltaTime;
        }
    }
}
