import { _decorator } from 'cc';
import { ScreenController } from '../../core/ScreenController';
import { NavigationManager } from '../../core/NavigationManager';
import { ScreenId } from '../../core/ScreenId';
import { FacebookAuthService } from '../../native/FacebookAuthService';

const { ccclass } = _decorator;

/**
 * Replaces Assets/Scripts/Controllers/AccountCenterController.cs.
 * GameExitBtn() was an empty method in the Unity source (no-op) - left as a
 * no-op here too rather than inventing behavior (e.g. Cocos has no generic
 * "quit" API on most platforms anyway; app-exit on mobile is normally left
 * to the OS back-gesture, not a button).
 */
@ccclass('AccountCenterScreenController')
export class AccountCenterScreenController extends ScreenController<void> {
    onGameExitBtn(): void {
        // intentionally empty - matches the Unity source.
    }

    async onBindFacebookBtn(): Promise<void> {
        NavigationManager.instance.push(ScreenId.Loading);

        const result = await FacebookAuthService.login();

        if (result.success) {
            NavigationManager.instance.replace(ScreenId.Home);
        } else {
            // Unity's LoginCallback only Debug.Log'd cancel/error cases with
            // no user-facing feedback and no navigation change - matching
            // that here, though a real error toast is worth adding once
            // there's a screen designed for it (not present in the source).
            console.log('[AccountCenter] Facebook login did not complete:', result.cancelled ? 'cancelled' : result.error);
            NavigationManager.instance.pop();
        }
    }
}
