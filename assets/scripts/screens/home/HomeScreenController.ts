import { _decorator, Label } from 'cc';
import { ScreenController } from '../../core/ScreenController';
import { NavigationManager } from '../../core/NavigationManager';
import { ScreenId } from '../../core/ScreenId';
import { UserStore } from '../../core/UserStore';
import { formatCurrency } from '../../core/CurrencyFormat';

const { ccclass, property } = _decorator;

/**
 * Replaces Assets/Scripts/Controllers/HomeController.cs +
 * Assets/Scripts/Managers/HomeUIManager.cs (which only added totalCoins/
 * totalGems Label fields via its CoinsGemsController base class - no other
 * logic of its own).
 *
 * Every nav button in the Unity source is a one-liner calling
 * GameManager.instance.ChangeState(...) with a commented-out
 * SceneManager.LoadScene(...) above it - ported here as NavigationManager.push().
 */
@ccclass('HomeScreenController')
export class HomeScreenController extends ScreenController<void> {
    @property(Label)
    totalCoinsLabel: Label | null = null;

    @property(Label)
    totalGemsLabel: Label | null = null;

    private unsubscribeUser: (() => void) | null = null;

    onEnter(): void {
        this.unsubscribeUser = UserStore.subscribe((user) => {
            if (this.totalCoinsLabel) this.totalCoinsLabel.string = formatCurrency(user.coins);
            if (this.totalGemsLabel) this.totalGemsLabel.string = formatCurrency(user.gems);
        });
    }

    onExit(): void {
        this.unsubscribeUser?.();
        this.unsubscribeUser = null;
    }

    onProfileBtn(): void {
        NavigationManager.instance.push(ScreenId.Profile);
    }

    onShopBtn(): void {
        NavigationManager.instance.push(ScreenId.Shop);
    }

    onSettingBtn(): void {
        NavigationManager.instance.push(ScreenId.Setting);
    }

    onLeaderboardBtn(): void {
        NavigationManager.instance.push(ScreenId.Leaderboard);
    }

    onCollectionBtn(): void {
        NavigationManager.instance.push(ScreenId.Collection);
    }

    onSingleMatchesBtn(): void {
        NavigationManager.instance.push(ScreenId.SingleMatches);
    }

    onTournamentBtn(): void {
        NavigationManager.instance.push(ScreenId.Tournament);
    }

    onVIPRoomBtn(): void {
        NavigationManager.instance.push(ScreenId.VIPRoom);
    }

    onEventsBtn(): void {
        NavigationManager.instance.push(ScreenId.Events);
    }

    onFriendsBtn(): void {
        NavigationManager.instance.push(ScreenId.Friends);
    }

    onClubsBtn(): void {
        NavigationManager.instance.push(ScreenId.Clubs);
    }
}
