import { _decorator, Label } from 'cc';
import { ScreenController } from '../../core/ScreenController';
import { NavigationManager } from '../../core/NavigationManager';
import { UserStore } from '../../core/UserStore';
import { formatCurrency } from '../../core/CurrencyFormat';

const { ccclass, property } = _decorator;

/**
 * Replaces Assets/Scripts/Controllers/ShopController.cs +
 * Assets/Scripts/Managers/ShopUIManager.cs.
 *
 * CloseBtn() branched on the static EventsUIManager.instance.isVIP bool
 * (set by EventsController.VIPSubscriptionBtn() right before navigating
 * here) to decide whether to return to Events or Home, then had to
 * manually reset the bool afterwards. NavigationManager.pop() replaces the
 * whole thing: whichever screen pushed Shop (Home, or Events via its VIP
 * button) is exactly what pop() returns to, with no flag to set or reset -
 * isVIP didn't need a typed-store replacement at all, it was purely
 * navigation-destination bookkeeping that the stack now does for free.
 *
 * No IAP exists anywhere in the Unity source (confirmed by the port-plan
 * survey) - this is coin/gem/VIP display only, same as the source.
 */
@ccclass('ShopScreenController')
export class ShopScreenController extends ScreenController<void> {
    @property(Label) totalCoinsLabel: Label | null = null;
    @property(Label) totalGemsLabel: Label | null = null;

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

    onCloseBtn(): void {
        NavigationManager.instance.pop();
    }
}
