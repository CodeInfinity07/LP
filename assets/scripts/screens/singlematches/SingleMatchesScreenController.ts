import { _decorator, Label } from 'cc';
import { ScreenController } from '../../core/ScreenController';
import { NavigationManager } from '../../core/NavigationManager';
import { ScreenId } from '../../core/ScreenId';
import { UserStore } from '../../core/UserStore';
import { formatCurrency } from '../../core/CurrencyFormat';
import { MatchParams } from '../../game/MatchScreenController';

const { ccclass, property } = _decorator;

/**
 * Replaces Assets/Scripts/Controllers/SingleMatchesController.cs +
 * Assets/Scripts/Managers/SingleMatchesUIManager.cs.
 *
 * The Unity source had no "start match" handler at all - only HomeBtn() and
 * the coin/gem display. onPlayBtn() below is new functionality, not a port
 * of anything: per the port plan's Phase 3 item 7, this entry point gets
 * wired to ScreenId.Match once Phase 5's gameplay exists (it now does - see
 * game/MatchScreenController.ts). Starts a local 4-seat match against 3
 * bots, matching what a "Single Matches" (as opposed to online multiplayer)
 * screen implies - there's no server-side matchmaking concept anywhere in
 * the source either way.
 */
@ccclass('SingleMatchesScreenController')
export class SingleMatchesScreenController extends ScreenController<void> {
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

    onHomeBtn(): void {
        NavigationManager.instance.pop();
    }

    onPlayBtn(): void {
        const params: MatchParams = {
            matchId: `local-${Date.now()}`,
            mode: 'local',
            localSeat: 0,
            localPlayers: [
                { seat: 0, userId: UserStore.value?.userId ?? 'me', color: 'red' },
                { seat: 1, userId: 'bot-1', color: 'blue', isBot: true },
                { seat: 2, userId: 'bot-2', color: 'yellow', isBot: true },
                { seat: 3, userId: 'bot-3', color: 'green', isBot: true },
            ],
        };
        NavigationManager.instance.push(ScreenId.Match, params);
    }
}
