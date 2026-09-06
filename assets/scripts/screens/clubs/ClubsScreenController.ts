import { _decorator, Node, Prefab, instantiate } from 'cc';
import { ScreenController } from '../../core/ScreenController';
import { NavigationManager } from '../../core/NavigationManager';
import { ScreenId } from '../../core/ScreenId';
import { SocketService } from '../../core/SocketService';

const { ccclass, property } = _decorator;

type MainTab = 'Explore' | 'Hot' | 'MyClubs';
type MyClubsSubTab = 'Recently' | 'Joined' | 'Following' | 'Friends';

/**
 * Replaces Assets/Scripts/Controllers/ClubsController.cs +
 * Assets/Scripts/Managers/ClubsUIManager.cs.
 *
 * Deliberate behavior fix, not a literal port: in the Unity source,
 * ExploreTabBtn()/HotTabBtn() each also re-display whichever MyClubs
 * sub-tab panel (Recently/Joined/Following/Friends) was last selected,
 * WITHOUT re-activating myClubsTabPanel itself - and every sub-tab button
 * (RecentlyTabBtn etc.) unconditionally forces myClubSelectedBG/
 * myClubsTabPanel active regardless of which main tab was showing. Read
 * together, clicking Explore or Hot can leave a "My Clubs" sub-list panel
 * visible with no main-tab container backing it - almost certainly leftover
 * behavior from an earlier tab layout, not an intentional cross-tab display.
 * This port instead treats MyClubs sub-tabs as only meaningful while
 * mainTab === 'MyClubs', which is what every other tabbed screen in this
 * app already does (Friends, Leaderboard's month/all-time, Gifts). Flagged
 * per the port plan's Phase 4 open question - confirm with the team if
 * Explore/Hot really are supposed to show a stale MyClubs sub-panel
 * underneath; nothing here currently justifies it as intentional.
 *
 * ProfilePageBtn() no longer needs the isClubProfilePage flag - see
 * profile/ProfileScreenController.ts, NavigationManager.pop() already
 * returns here directly.
 */
@ccclass('ClubsScreenController')
export class ClubsScreenController extends ScreenController<void> {
    @property(Node) exploreTabPanel: Node | null = null;
    @property(Node) hotTabPanel: Node | null = null;
    @property(Node) myClubsTabPanel: Node | null = null;
    @property(Node) exploreTabSelectedBG: Node | null = null;
    @property(Node) hotTabSelectedBG: Node | null = null;
    @property(Node) myClubSelectedBG: Node | null = null;

    @property(Node) myClubsRecentlyTabPanel: Node | null = null;
    @property(Node) myClubsJoinedTabPanel: Node | null = null;
    @property(Node) myClubsFollowingTabPanel: Node | null = null;
    @property(Node) myClubsFriendsTabPanel: Node | null = null;
    @property(Node) myClubsRecentlyTabSelectedBG: Node | null = null;
    @property(Node) myClubsJoinedTabSelectedBG: Node | null = null;
    @property(Node) myClubsFollowingTabSelectedBG: Node | null = null;
    @property(Node) myClubsFriendsTabSelectedBG: Node | null = null;

    @property(Node) createMyRoomBG: Node | null = null;
    @property(Prefab) spawnMyClubRecentlyPrefab: Prefab | null = null;
    @property(Node) contentParent: Node | null = null;

    private mainTab: MainTab = 'Explore';
    private myClubsSubTab: MyClubsSubTab = 'Recently';

    onEnter(): void {
        this.render();
    }

    onHomeBtn(): void {
        NavigationManager.instance.pop();
    }

    onEventsBtn(): void {
        NavigationManager.instance.push(ScreenId.Events);
    }

    onFriendsBtn(): void {
        NavigationManager.instance.push(ScreenId.Friends);
    }

    onProfilePageBtn(): void {
        NavigationManager.instance.push(ScreenId.Profile);
    }

    onExploreTabBtn(): void {
        this.mainTab = 'Explore';
        this.render();
    }

    onHotTabBtn(): void {
        this.mainTab = 'Hot';
        this.render();
    }

    onMyClubsTabBtn(): void {
        this.mainTab = 'MyClubs';
        this.render();
    }

    onRecentlyTabBtn(): void {
        this.mainTab = 'MyClubs';
        this.myClubsSubTab = 'Recently';
        this.render();
    }

    onJoinedTabBtn(): void {
        this.mainTab = 'MyClubs';
        this.myClubsSubTab = 'Joined';
        this.render();
    }

    onFollowingTabBtn(): void {
        this.mainTab = 'MyClubs';
        this.myClubsSubTab = 'Following';
        this.render();
    }

    onFriendsTabBtn(): void {
        this.mainTab = 'MyClubs';
        this.myClubsSubTab = 'Friends';
        this.render();
    }

    onGiftsLeaderboardBtn(): void {
        NavigationManager.instance.push(ScreenId.Gifts);
    }

    onClubsEnterBtn(): void {
        NavigationManager.instance.push(ScreenId.ClubsMain);
    }

    onCreateRoomBtn(): void {
        SocketService.createClub('Create Room');
        NavigationManager.instance.push(ScreenId.ClubsMain);
        if (this.createMyRoomBG) this.createMyRoomBG.active = false;
        this.spawnClub();
    }

    /** Called by ClubsMainScreenController.onExitClubBtn() after popping back here - see NavigationManager.currentController. */
    selectMyClubsTab(): void {
        this.mainTab = 'MyClubs';
        this.render();
    }

    private spawnClub(): void {
        if (!this.spawnMyClubRecentlyPrefab || !this.contentParent) {
            return;
        }
        const club = instantiate(this.spawnMyClubRecentlyPrefab);
        this.contentParent.addChild(club);
    }

    private render(): void {
        const set = (node: Node | null, active: boolean) => {
            if (node) node.active = active;
        };

        set(this.exploreTabPanel, this.mainTab === 'Explore');
        set(this.exploreTabSelectedBG, this.mainTab === 'Explore');
        set(this.hotTabPanel, this.mainTab === 'Hot');
        set(this.hotTabSelectedBG, this.mainTab === 'Hot');
        set(this.myClubsTabPanel, this.mainTab === 'MyClubs');
        set(this.myClubSelectedBG, this.mainTab === 'MyClubs');

        const isMyClubs = this.mainTab === 'MyClubs';
        set(this.myClubsRecentlyTabPanel, isMyClubs && this.myClubsSubTab === 'Recently');
        set(this.myClubsRecentlyTabSelectedBG, isMyClubs && this.myClubsSubTab === 'Recently');
        set(this.myClubsJoinedTabPanel, isMyClubs && this.myClubsSubTab === 'Joined');
        set(this.myClubsJoinedTabSelectedBG, isMyClubs && this.myClubsSubTab === 'Joined');
        set(this.myClubsFollowingTabPanel, isMyClubs && this.myClubsSubTab === 'Following');
        set(this.myClubsFollowingTabSelectedBG, isMyClubs && this.myClubsSubTab === 'Following');
        set(this.myClubsFriendsTabPanel, isMyClubs && this.myClubsSubTab === 'Friends');
        set(this.myClubsFriendsTabSelectedBG, isMyClubs && this.myClubsSubTab === 'Friends');
    }
}
