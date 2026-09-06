import { _decorator, Label, Node } from 'cc';
import { ScreenController } from '../../core/ScreenController';
import { NavigationManager } from '../../core/NavigationManager';
import { UserStore } from '../../core/UserStore';
import { formatCurrency } from '../../core/CurrencyFormat';

const { ccclass, property } = _decorator;

/**
 * Replaces Assets/Scripts/Controllers/TournamentController.cs +
 * Assets/Scripts/Managers/TournamentUIManager.cs. TournamentStageScene
 * (a separate .unity scene in the Unity source) becomes tournamentStagePanel,
 * a simple toggled panel on this same screen, matching how ViewToggleBtn()
 * already treated it in the source (SetActive toggle, not a scene load).
 */
@ccclass('TournamentScreenController')
export class TournamentScreenController extends ScreenController<void> {
    @property(Label) totalCoinsLabel: Label | null = null;
    @property(Label) totalGemsLabel: Label | null = null;
    @property(Node) tournamentStagePanel: Node | null = null;

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

    onViewToggleBtn(): void {
        if (this.tournamentStagePanel) this.tournamentStagePanel.active = !this.tournamentStagePanel.active;
    }
}
