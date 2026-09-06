import { _decorator, Node } from 'cc';
import { ScreenController } from '../../core/ScreenController';
import { NavigationManager } from '../../core/NavigationManager';
import { ScreenId } from '../../core/ScreenId';

const { ccclass, property } = _decorator;

type FriendsTab = 'Facebook' | 'Game' | 'Messages' | 'Recent';

/**
 * Replaces Assets/Scripts/Controllers/FriendsUIController.cs +
 * Assets/Scripts/Managers/FriendsUIManager.cs. Four mutually-exclusive tabs
 * (the DeactivateAllTabs/DeactivateAllTabsSelectedBG pattern) collapse to
 * one enum + render(), same approach as Collection/Leaderboard/Gifts.
 */
@ccclass('FriendsScreenController')
export class FriendsScreenController extends ScreenController<void> {
    @property(Node) faceBookFriendsTabPanel: Node | null = null;
    @property(Node) gameFriendsTabPanel: Node | null = null;
    @property(Node) messagesTabPanel: Node | null = null;
    @property(Node) recentTabPanel: Node | null = null;

    @property(Node) facebookFriendsTabSelectedBG: Node | null = null;
    @property(Node) gameFriendsTabSelectedBG: Node | null = null;
    @property(Node) messagesTabSelectedBG: Node | null = null;
    @property(Node) recentTabSelectedBG: Node | null = null;

    @property(Node) gameFriendRequestPanel: Node | null = null;
    @property(Node) friendRequestMessagesPanel: Node | null = null;

    private tab: FriendsTab | null = null;

    onHomeBtn(): void {
        NavigationManager.instance.pop();
    }

    onEventsBtn(): void {
        NavigationManager.instance.push(ScreenId.Events);
    }

    onClubsBtn(): void {
        NavigationManager.instance.push(ScreenId.Clubs);
    }

    onFacebookFriendsTabBtn(): void {
        this.tab = 'Facebook';
        this.render();
    }

    onGameFriendsTabBtn(): void {
        this.tab = 'Game';
        this.render();
    }

    onMessagesTabBtn(): void {
        this.tab = 'Messages';
        this.render();
    }

    onRecentTabBtn(): void {
        this.tab = 'Recent';
        this.render();
    }

    onAddGameFriendRequestToggleBtn(): void {
        if (this.gameFriendRequestPanel) this.gameFriendRequestPanel.active = !this.gameFriendRequestPanel.active;
    }

    onFriendRequestsMessagesToggleBtn(): void {
        if (this.friendRequestMessagesPanel) this.friendRequestMessagesPanel.active = !this.friendRequestMessagesPanel.active;
    }

    private render(): void {
        const set = (node: Node | null, active: boolean) => {
            if (node) node.active = active;
        };
        set(this.faceBookFriendsTabPanel, this.tab === 'Facebook');
        set(this.facebookFriendsTabSelectedBG, this.tab === 'Facebook');
        set(this.gameFriendsTabPanel, this.tab === 'Game');
        set(this.gameFriendsTabSelectedBG, this.tab === 'Game');
        set(this.messagesTabPanel, this.tab === 'Messages');
        set(this.messagesTabSelectedBG, this.tab === 'Messages');
        set(this.recentTabPanel, this.tab === 'Recent');
        set(this.recentTabSelectedBG, this.tab === 'Recent');
    }
}
