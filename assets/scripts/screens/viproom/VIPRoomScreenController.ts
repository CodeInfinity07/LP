import { _decorator } from 'cc';
import { ScreenController } from '../../core/ScreenController';
import { NavigationManager } from '../../core/NavigationManager';

const { ccclass } = _decorator;

/** Replaces Assets/Scripts/Controllers/VIPRoomController.cs (a single CloseBtn() one-liner, no UIManager). */
@ccclass('VIPRoomScreenController')
export class VIPRoomScreenController extends ScreenController<void> {
    onCloseBtn(): void {
        NavigationManager.instance.pop();
    }
}
