import { _decorator } from 'cc';
import { ScreenController } from '../../core/ScreenController';
import { NavigationManager } from '../../core/NavigationManager';

const { ccclass } = _decorator;

/** Replaces Assets/Scripts/Controllers/SettingController.cs (a single HomeBtn() one-liner). */
@ccclass('SettingScreenController')
export class SettingScreenController extends ScreenController<void> {
    onHomeBtn(): void {
        NavigationManager.instance.pop();
    }
}
