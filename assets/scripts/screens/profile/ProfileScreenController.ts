import { _decorator, Label } from 'cc';
import { ScreenController } from '../../core/ScreenController';
import { NavigationManager } from '../../core/NavigationManager';
import { UserStore } from '../../core/UserStore';

const { ccclass, property } = _decorator;

/**
 * Replaces Assets/Scripts/Controllers/ProfileController.cs +
 * Assets/Scripts/Managers/ProfileUIManager.cs.
 *
 * CloseBtn() in the Unity source branched on four different
 * ClubsUIManager static bools (isExploreTab/isHotTab/isMyClubsTab/
 * isClubProfilePage) to decide whether "close" should return to Clubs or
 * Home, then had to manually reset whichever bool it used. That entire
 * branch collapses to a single NavigationManager.pop() here: whichever
 * screen pushed Profile onto the stack (Home, or one of the Clubs tabs) is
 * exactly what pop() returns to, with nothing to reset because there's no
 * stray global state to begin with. This is the concrete payoff of the
 * navigation-stack investment made in Phase 1.
 */
@ccclass('ProfileScreenController')
export class ProfileScreenController extends ScreenController<void> {
    @property(Label) profileNameLabel: Label | null = null;
    @property(Label) profileLevelLabel: Label | null = null;
    @property(Label) profileUniqueGameIdLabel: Label | null = null;
    @property(Label) profileTotalGamesLabel: Label | null = null;
    @property(Label) profileCurrentLeagueLabel: Label | null = null;
    @property(Label) profileHighestLeagueLabel: Label | null = null;
    @property(Label) profileWinRatioLabel: Label | null = null;

    private unsubscribeUser: (() => void) | null = null;

    onEnter(): void {
        this.unsubscribeUser = UserStore.subscribe((user) => {
            if (this.profileNameLabel) this.profileNameLabel.string = user.name;
            if (this.profileLevelLabel) this.profileLevelLabel.string = String(user.level);
            if (this.profileUniqueGameIdLabel) this.profileUniqueGameIdLabel.string = user.uniqueGameId;
            if (this.profileTotalGamesLabel) this.profileTotalGamesLabel.string = String(user.totalGames);
            if (this.profileCurrentLeagueLabel) this.profileCurrentLeagueLabel.string = user.currentLeague;
            if (this.profileHighestLeagueLabel) this.profileHighestLeagueLabel.string = user.highestLeague;
            // matches C#'s (winRatio * 100f).ToString("F1") + "%" - one decimal place.
            if (this.profileWinRatioLabel) this.profileWinRatioLabel.string = (user.winRatio * 100).toFixed(1) + '%';
        });
    }

    onExit(): void {
        this.unsubscribeUser?.();
        this.unsubscribeUser = null;
    }

    onCloseBtn(): void {
        NavigationManager.instance.pop();
    }
}
