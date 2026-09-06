import { _decorator, Label, Node } from 'cc';
import { ScreenController } from '../../core/ScreenController';
import { NavigationManager } from '../../core/NavigationManager';
import { ScreenId } from '../../core/ScreenId';
import { UserStore } from '../../core/UserStore';
import { formatCurrency } from '../../core/CurrencyFormat';

const { ccclass, property } = _decorator;

/**
 * Replaces Assets/Scripts/Controllers/EventsController.cs +
 * Assets/Scripts/Managers/EventsUIManager.cs.
 *
 * VIPSubscriptionBtn() navigated to Shop and set the static
 * EventsUIManager.isVIP bool purely so Shop's CloseBtn() knew to route back
 * here instead of Home - not needed anymore, see the note in
 * shop/ShopScreenController.ts: NavigationManager.instance.push(ScreenId.Shop)
 * plus NavigationManager.pop() on Shop's close handles the round trip with
 * no flag at all.
 */
@ccclass('EventsScreenController')
export class EventsScreenController extends ScreenController<void> {
    @property(Label) totalCoinsLabel: Label | null = null;
    @property(Label) totalGemsLabel: Label | null = null;

    @property(Node) freeRewardPanel: Node | null = null;
    @property(Node) goldChestPanel: Node | null = null;
    @property(Node) dailyTaskPanel: Node | null = null;
    @property(Node) arrivalChestPanel: Node | null = null;
    @property(Node) levelRewardPanel: Node | null = null;
    @property(Node) basicInfoPanel: Node | null = null;

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

    onHomeBtn(): void {
        NavigationManager.instance.pop();
    }

    onFriendsBtn(): void {
        NavigationManager.instance.push(ScreenId.Friends);
    }

    onClubsBtn(): void {
        NavigationManager.instance.push(ScreenId.Clubs);
    }

    onVIPSubscriptionBtn(): void {
        NavigationManager.instance.push(ScreenId.Shop);
    }

    onFreeRewardsToggleBtn(): void {
        this.toggle(this.freeRewardPanel);
    }

    onGoldChestToggleBtn(): void {
        this.toggle(this.goldChestPanel);
    }

    onDailyTaskToggleBtn(): void {
        this.toggle(this.dailyTaskPanel);
    }

    onArrivalChestToggleBtn(): void {
        this.toggle(this.arrivalChestPanel);
    }

    onLevelRewardToggleBtn(): void {
        this.toggle(this.levelRewardPanel);
    }

    onBasicInfoToggleBtn(): void {
        this.toggle(this.basicInfoPanel);
    }

    private toggle(panel: Node | null): void {
        if (panel) panel.active = !panel.active;
    }
}
