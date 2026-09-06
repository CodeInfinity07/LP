import { _decorator, Label, Node } from 'cc';
import { ScreenController } from '../../core/ScreenController';
import { NavigationManager } from '../../core/NavigationManager';
import { ClubStore } from '../../core/ClubStore';
import { ClubsScreenController } from './ClubsScreenController';

const { ccclass, property } = _decorator;

type InfoTab = 'Profile' | 'Members';

/**
 * Replaces Assets/Scripts/Controllers/ClubsMainController.cs +
 * Assets/Scripts/Managers/ClubsMainUIManager.cs.
 *
 * ExitClubBtn() forced ClubsUIManager.isMyClubsTab = true before navigating
 * back, so leaving a club always lands back on the Clubs screen's MyClubs
 * tab specifically - regardless of which tab was showing when ClubsMain was
 * entered. That's a deliberate UX decision (unlike the Explore/Hot sub-panel
 * bleed-through flagged in ClubsScreenController.ts), so it's preserved:
 * pop back to Clubs, then explicitly tell it to select MyClubs via
 * NavigationManager.currentController rather than resurrecting a static bool.
 */
@ccclass('ClubsMainScreenController')
export class ClubsMainScreenController extends ScreenController<void> {
    @property(Label) clubNameInfoLabel: Label | null = null;
    @property(Label) clubCodeLabel: Label | null = null;
    @property(Label) clubNameLabel: Label | null = null;
    @property(Label) announcementLabel: Label | null = null;

    @property(Node) clubInfoPanel: Node | null = null;
    @property(Node) profileTab: Node | null = null;
    @property(Node) membersTab: Node | null = null;
    @property(Node) profileTabSelectedBG: Node | null = null;
    @property(Node) membersTabSelectedBG: Node | null = null;

    private infoTab: InfoTab = 'Members';
    private unsubscribeClub: (() => void) | null = null;

    onEnter(): void {
        this.unsubscribeClub = ClubStore.subscribe((club) => {
            if (this.clubNameLabel) this.clubNameLabel.string = club.clubName;
            if (this.clubCodeLabel) this.clubCodeLabel.string = club.clubCode;
            if (this.announcementLabel) this.announcementLabel.string = club.announcement;
            if (this.clubNameInfoLabel) this.clubNameInfoLabel.string = club.clubName;
        });
    }

    onExit(): void {
        this.unsubscribeClub?.();
        this.unsubscribeClub = null;
    }

    onExitClubBtn(): void {
        NavigationManager.instance.pop();
        const clubs = NavigationManager.instance.currentController;
        if (clubs instanceof ClubsScreenController) {
            clubs.selectMyClubsTab();
        }
    }

    onClubInfoToggleBtn(): void {
        if (this.clubInfoPanel) this.clubInfoPanel.active = !this.clubInfoPanel.active;
    }

    onProfileTabBtn(): void {
        this.infoTab = 'Profile';
        this.render();
    }

    onMembersTabBtn(): void {
        this.infoTab = 'Members';
        this.render();
    }

    private render(): void {
        const set = (node: Node | null, active: boolean) => {
            if (node) node.active = active;
        };
        set(this.profileTab, this.infoTab === 'Profile');
        set(this.profileTabSelectedBG, this.infoTab === 'Profile');
        set(this.membersTab, this.infoTab === 'Members');
        set(this.membersTabSelectedBG, this.infoTab === 'Members');
    }
}
