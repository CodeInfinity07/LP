import { _decorator, Node } from 'cc';
import { ScreenController } from '../../core/ScreenController';
import { NavigationManager } from '../../core/NavigationManager';

const { ccclass, property } = _decorator;

type MainTab = 'Room' | 'Sent' | 'Received' | null;
type Period = 'Hourly' | 'Daily' | 'Weekly' | 'Monthly';

/**
 * Replaces Assets/Scripts/Controllers/GiftsUIController.cs +
 * Assets/Scripts/Managers/GiftsUIManager.cs - by far the largest
 * DeactivateAllTabs()/DeactivateAllTabsSelectedBG() panel-soup screen in the
 * source (three main tabs, each with its own period sub-tab, ~30 GameObject
 * references toggled in every handler). Collapses to one mainTab + one
 * period-per-tab, same render() approach as Collection/Friends/Leaderboard.
 *
 * CloseBtn() in the source force-set the static ClubsUIManager.isHotTab = true
 * before navigating to Clubs, since Gifts is only ever opened from Clubs'
 * Hot tab and the old static-state navigation had no other way to remember
 * that. With the nav stack, whichever Clubs tab was showing when Gifts was
 * pushed is still showing on its (deactivated, not destroyed) node - pop()
 * alone reveals it exactly as it was, no flag needed.
 */
@ccclass('GiftsScreenController')
export class GiftsScreenController extends ScreenController<void> {
    @property(Node) giftsRoomTabPanel: Node | null = null;
    @property(Node) giftsSentTabPanel: Node | null = null;
    @property(Node) giftsReceivedTabPanel: Node | null = null;
    @property(Node) giftsRoomTabSelectedBG: Node | null = null;
    @property(Node) giftsSentTabSelectedBG: Node | null = null;
    @property(Node) giftsReceivedTabSelectedBG: Node | null = null;

    @property(Node) giftsRoomHourlyTabPanel: Node | null = null;
    @property(Node) giftsRoomDailyTabPanel: Node | null = null;
    @property(Node) giftsRoomWeeklyTabPanel: Node | null = null;
    @property(Node) giftsRoomMonthlyTabPanel: Node | null = null;
    @property(Node) giftsRoomHourlyTabSelectedBG: Node | null = null;
    @property(Node) giftsRoomDailyTabSelectedBG: Node | null = null;
    @property(Node) giftsRoomWeeklyTabSelectedBG: Node | null = null;
    @property(Node) giftsRoomMonthlyTabSelectedBG: Node | null = null;

    @property(Node) giftsSentDailyTabPanel: Node | null = null;
    @property(Node) giftsSentWeeklyTabPanel: Node | null = null;
    @property(Node) giftsSentMonthlyTabPanel: Node | null = null;
    @property(Node) giftsSentDailyTabSelectedBg: Node | null = null;
    @property(Node) giftsSentWeeklyTabSelectedBG: Node | null = null;
    @property(Node) giftsSentMonthlyTabSelectedBG: Node | null = null;

    @property(Node) giftsReceivedDailyTabPanel: Node | null = null;
    @property(Node) giftsReceivedWeeklyTabPanel: Node | null = null;
    @property(Node) giftsReceivedMonthlyTabPanel: Node | null = null;
    @property(Node) giftsReceivedDailyTabSelectedBG: Node | null = null;
    @property(Node) giftsReceivedWeeklyTabSelectedBG: Node | null = null;
    @property(Node) giftsReceivedMonthlyTabSelectedBG: Node | null = null;

    private mainTab: MainTab = null;
    // Room defaults to "Hourly" (the source's default GiftsRoomTabBtn selection);
    // Sent/Received default to "Daily" - matches GiftsSentTabBtn/GiftsReceivedTabBtn.
    private roomPeriod: Period = 'Hourly';
    private sentPeriod: Period = 'Daily';
    private receivedPeriod: Period = 'Daily';

    onCloseBtn(): void {
        NavigationManager.instance.pop();
    }

    onGiftsRoomTabBtn(): void {
        this.mainTab = 'Room';
        this.roomPeriod = 'Hourly';
        this.render();
    }

    onGiftsSentTabBtn(): void {
        this.mainTab = 'Sent';
        this.sentPeriod = 'Daily';
        this.render();
    }

    onGiftsReceivedTabBtn(): void {
        this.mainTab = 'Received';
        this.receivedPeriod = 'Daily';
        this.render();
    }

    onGiftsRoomHourlyTabBtn(): void {
        this.mainTab = 'Room';
        this.roomPeriod = 'Hourly';
        this.render();
    }

    onGiftsRoomDailyTabBtn(): void {
        this.mainTab = 'Room';
        this.roomPeriod = 'Daily';
        this.render();
    }

    onGiftsRoomWeeklyTabBtn(): void {
        this.mainTab = 'Room';
        this.roomPeriod = 'Weekly';
        this.render();
    }

    onGiftsRoomMonthlyTabBtn(): void {
        this.mainTab = 'Room';
        this.roomPeriod = 'Monthly';
        this.render();
    }

    onGiftsSentDailyTabBtn(): void {
        this.mainTab = 'Sent';
        this.sentPeriod = 'Daily';
        this.render();
    }

    onGiftsSentWeeklyTabBtn(): void {
        this.mainTab = 'Sent';
        this.sentPeriod = 'Weekly';
        this.render();
    }

    onGiftsSentMonthlyTabBtn(): void {
        this.mainTab = 'Sent';
        this.sentPeriod = 'Monthly';
        this.render();
    }

    onGiftsReceivedDailyTabBtn(): void {
        this.mainTab = 'Received';
        this.receivedPeriod = 'Daily';
        this.render();
    }

    onGiftsReceivedWeeklyTabBtn(): void {
        this.mainTab = 'Received';
        this.receivedPeriod = 'Weekly';
        this.render();
    }

    onGiftsReceivedMonthlyTabBtn(): void {
        this.mainTab = 'Received';
        this.receivedPeriod = 'Monthly';
        this.render();
    }

    private render(): void {
        const set = (node: Node | null, active: boolean) => {
            if (node) node.active = active;
        };

        set(this.giftsRoomTabPanel, this.mainTab === 'Room');
        set(this.giftsRoomTabSelectedBG, this.mainTab === 'Room');
        set(this.giftsSentTabPanel, this.mainTab === 'Sent');
        set(this.giftsSentTabSelectedBG, this.mainTab === 'Sent');
        set(this.giftsReceivedTabPanel, this.mainTab === 'Received');
        set(this.giftsReceivedTabSelectedBG, this.mainTab === 'Received');

        const isRoom = this.mainTab === 'Room';
        set(this.giftsRoomHourlyTabPanel, isRoom && this.roomPeriod === 'Hourly');
        set(this.giftsRoomHourlyTabSelectedBG, isRoom && this.roomPeriod === 'Hourly');
        set(this.giftsRoomDailyTabPanel, isRoom && this.roomPeriod === 'Daily');
        set(this.giftsRoomDailyTabSelectedBG, isRoom && this.roomPeriod === 'Daily');
        set(this.giftsRoomWeeklyTabPanel, isRoom && this.roomPeriod === 'Weekly');
        set(this.giftsRoomWeeklyTabSelectedBG, isRoom && this.roomPeriod === 'Weekly');
        set(this.giftsRoomMonthlyTabPanel, isRoom && this.roomPeriod === 'Monthly');
        set(this.giftsRoomMonthlyTabSelectedBG, isRoom && this.roomPeriod === 'Monthly');

        const isSent = this.mainTab === 'Sent';
        set(this.giftsSentDailyTabPanel, isSent && this.sentPeriod === 'Daily');
        set(this.giftsSentDailyTabSelectedBg, isSent && this.sentPeriod === 'Daily');
        set(this.giftsSentWeeklyTabPanel, isSent && this.sentPeriod === 'Weekly');
        set(this.giftsSentWeeklyTabSelectedBG, isSent && this.sentPeriod === 'Weekly');
        set(this.giftsSentMonthlyTabPanel, isSent && this.sentPeriod === 'Monthly');
        set(this.giftsSentMonthlyTabSelectedBG, isSent && this.sentPeriod === 'Monthly');

        const isReceived = this.mainTab === 'Received';
        set(this.giftsReceivedDailyTabPanel, isReceived && this.receivedPeriod === 'Daily');
        set(this.giftsReceivedDailyTabSelectedBG, isReceived && this.receivedPeriod === 'Daily');
        set(this.giftsReceivedWeeklyTabPanel, isReceived && this.receivedPeriod === 'Weekly');
        set(this.giftsReceivedWeeklyTabSelectedBG, isReceived && this.receivedPeriod === 'Weekly');
        set(this.giftsReceivedMonthlyTabPanel, isReceived && this.receivedPeriod === 'Monthly');
        set(this.giftsReceivedMonthlyTabSelectedBG, isReceived && this.receivedPeriod === 'Monthly');
    }
}
