import { _decorator, Node } from 'cc';
import { ScreenController } from '../../core/ScreenController';
import { NavigationManager } from '../../core/NavigationManager';

const { ccclass, property } = _decorator;

type TimeRange = 'thisMonth' | 'allTime';

/**
 * Replaces Assets/Scripts/Controllers/LeaderboardController.cs +
 * Assets/Scripts/Managers/LeaderboardUIManager.cs.
 *
 * Unity's six panel-toggle buttons (Global/LudoBillionaire/LegendStar/
 * AchievementBadge/UniqueIDRanking/Friends) each independently flip their
 * own panel's SetActive(!activeSelf) - these are expandable sections, not a
 * mutually-exclusive tab set, so they port as independent local booleans
 * rather than a single "selected tab" enum (unlike Collection's tabs, see
 * CollectionScreenController.ts). The This-Month/All-Time pair IS mutually
 * exclusive and is scoped to the UniqueIDRanking panel specifically
 * (UniqueIDRankingToggleBtn calls ThisMonthBtn() as its default) - kept as
 * its own bit of local state.
 */
@ccclass('LeaderboardScreenController')
export class LeaderboardScreenController extends ScreenController<void> {
    @property(Node) globalPanel: Node | null = null;
    @property(Node) ludoBillionairePanel: Node | null = null;
    @property(Node) legendStarPanel: Node | null = null;
    @property(Node) achievementBadgeWallPanel: Node | null = null;
    @property(Node) uniqueIDRankingPanel: Node | null = null;
    @property(Node) friendsPanel: Node | null = null;

    @property(Node) thisMonthPanel: Node | null = null;
    @property(Node) thisMonthSelectedBG: Node | null = null;
    @property(Node) allTimePanel: Node | null = null;
    @property(Node) allTimeSelectedBG: Node | null = null;

    private timeRange: TimeRange = 'thisMonth';

    onHomeBtn(): void {
        NavigationManager.instance.pop();
    }

    onGlobalToggleBtn(): void {
        this.toggle(this.globalPanel);
    }

    onLudoBillionaireToggleBtn(): void {
        this.toggle(this.ludoBillionairePanel);
    }

    onLegendStarToggleBtn(): void {
        this.toggle(this.legendStarPanel);
    }

    onAchievementBadgeToggleBtn(): void {
        this.toggle(this.achievementBadgeWallPanel);
    }

    onUniqueIDRankingToggleBtn(): void {
        this.toggle(this.uniqueIDRankingPanel);
        this.setTimeRange('thisMonth');
    }

    onFriendsToggleBtn(): void {
        this.toggle(this.friendsPanel);
    }

    onThisMonthBtn(): void {
        this.setTimeRange('thisMonth');
    }

    onAllTimeBtn(): void {
        this.setTimeRange('allTime');
    }

    private toggle(panel: Node | null): void {
        if (panel) panel.active = !panel.active;
    }

    private setTimeRange(range: TimeRange): void {
        this.timeRange = range;
        if (this.thisMonthPanel) this.thisMonthPanel.active = range === 'thisMonth';
        if (this.thisMonthSelectedBG) this.thisMonthSelectedBG.active = range === 'thisMonth';
        if (this.allTimePanel) this.allTimePanel.active = range === 'allTime';
        if (this.allTimeSelectedBG) this.allTimeSelectedBG.active = range === 'allTime';
    }
}
