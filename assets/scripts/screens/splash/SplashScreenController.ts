import { _decorator } from 'cc';
import { ScreenController } from '../../core/ScreenController';
import { NavigationManager } from '../../core/NavigationManager';
import { ScreenId } from '../../core/ScreenId';

const { ccclass } = _decorator;

/**
 * Replaces Assets/Scripts/Controllers/SplashController.cs: after a 1s
 * delay, moves to AccountCenter. The dead commented-out
 * "if FB_userId exists, auto-login" branch is not ported - see
 * FacebookAuthService.resumeSession() for the real (live, non-commented)
 * auto-login path this project uses instead, based on the persisted
 * server_auth_token rather than raw FB prefs.
 */
@ccclass('SplashScreenController')
export class SplashScreenController extends ScreenController<void> {
    onEnter(): void {
        this.scheduleOnce(() => {
            NavigationManager.instance.replace(ScreenId.AccountCenter);
        }, 1);
    }
}
