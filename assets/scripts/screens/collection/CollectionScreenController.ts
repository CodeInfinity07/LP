import { _decorator, Label, Node } from 'cc';
import { ScreenController } from '../../core/ScreenController';
import { NavigationManager } from '../../core/NavigationManager';
import { UserStore } from '../../core/UserStore';
import { formatCurrency } from '../../core/CurrencyFormat';

const { ccclass, property } = _decorator;

type MainTab = 'LudoSkin' | 'Sticker' | 'ProfileCard' | 'Theme' | 'PinOnTop' | 'RoyalVehicle' | 'EntryEffects' | 'Mine' | null;
type LudoSkinTab = 'Dice' | 'Token' | 'Bubble' | 'Theme';
type ThemeTab = 'Basic' | 'Royal';
type MineTab = 'Room' | 'Profile';

/**
 * Replaces Assets/Scripts/Controllers/CollectionController.cs +
 * Assets/Scripts/Managers/CollectionUIManager.cs.
 *
 * The Unity source is ~250 lines of DeactivateAllTabs()/
 * DeactivateAllTabsSelectedBG() calls (each individually SetActive(false)-ing
 * 8 main panels + 4 tab panels + 4 tab BGs + 2 sub-tab panels + 2 sub-tab
 * BGs, sixteen times over) followed by one button's worth of
 * SetActive(true) calls. It's a mutually-exclusive main-tab selector (8
 * tabs), where LudoSkin and Theme and Mine each additionally have their own
 * mutually-exclusive sub-tab. That whole shape is exactly what a few enum
 * fields plus one render() function express directly - collectionMainPanel
 * itself is never touched by any of it (DeactivateAllTabs skips it, CloseBtn
 * just re-affirms it true) so it isn't modeled as state at all, it's always
 * visible.
 */
@ccclass('CollectionScreenController')
export class CollectionScreenController extends ScreenController<void> {
    @property(Label) stickerTotalCoinsLabel: Label | null = null;
    @property([Label]) totalGemsLabels: Label[] = []; // replaces collectionTotalGemsTxt[]

    @property(Node) ludoSkinPanel: Node | null = null;
    @property(Node) stickerPanel: Node | null = null;
    @property(Node) profileCardPanel: Node | null = null;
    @property(Node) themePanel: Node | null = null;
    @property(Node) pinOnTopPanel: Node | null = null;
    @property(Node) royalVehiclePanel: Node | null = null;
    @property(Node) entryEffectsPanel: Node | null = null;
    @property(Node) minePanel: Node | null = null;

    @property(Node) diceTabPanel: Node | null = null;
    @property(Node) tokenTabPanel: Node | null = null;
    @property(Node) bubbleTabPanel: Node | null = null;
    @property(Node) themeTabPanel: Node | null = null;
    @property(Node) diceTabSelectedBG: Node | null = null;
    @property(Node) tokenTabSelectedBG: Node | null = null;
    @property(Node) bubbleTabSelectedBG: Node | null = null;
    @property(Node) themeTabSelectedBG: Node | null = null;

    @property(Node) basicThemeTabPanel: Node | null = null;
    @property(Node) royalThemeTabPanel: Node | null = null;
    @property(Node) basicThemeTabSelectedBG: Node | null = null;
    @property(Node) royalThemeTabSelectedBG: Node | null = null;

    @property(Node) roomThemeTabPanel: Node | null = null;
    @property(Node) profileThemeTabPanel: Node | null = null;
    @property(Node) roomThemeTabSelectedBG: Node | null = null;
    @property(Node) profileThemeTabSelectedBG: Node | null = null;

    @property(Node) bidPanel: Node | null = null;

    private mainTab: MainTab = null;
    private ludoSkinTab: LudoSkinTab = 'Dice';
    private themeTab: ThemeTab = 'Basic';
    private mineTab: MineTab = 'Room';

    private unsubscribeUser: (() => void) | null = null;

    onEnter(): void {
        this.unsubscribeUser = UserStore.subscribe((user) => {
            const gems = formatCurrency(user.gems);
            if (this.stickerTotalCoinsLabel) this.stickerTotalCoinsLabel.string = formatCurrency(user.coins);
            for (const label of this.totalGemsLabels) label.string = gems;
        });
        this.render();
    }

    onExit(): void {
        this.unsubscribeUser?.();
        this.unsubscribeUser = null;
    }

    onHomeBtn(): void {
        NavigationManager.instance.pop();
    }

    onCloseBtn(): void {
        this.mainTab = null;
        this.render();
    }

    onLudoSkinBtn(): void {
        this.mainTab = 'LudoSkin';
        this.ludoSkinTab = 'Dice';
        this.render();
    }

    onStickerBtn(): void {
        this.mainTab = 'Sticker';
        this.render();
    }

    onProfileCardBtn(): void {
        this.mainTab = 'ProfileCard';
        this.render();
    }

    onThemeBtn(): void {
        this.mainTab = 'Theme';
        this.themeTab = 'Basic';
        this.render();
    }

    onPinOnTopBtn(): void {
        this.mainTab = 'PinOnTop';
        this.render();
    }

    onRoyalVehicleBtn(): void {
        this.mainTab = 'RoyalVehicle';
        this.render();
    }

    onEntryEffectsBtn(): void {
        this.mainTab = 'EntryEffects';
        this.render();
    }

    onMineBtn(): void {
        this.mainTab = 'Mine';
        this.mineTab = 'Room';
        this.render();
    }

    /** MineCloseBtn() in the source just called ThemeBtn() - same here. */
    onMineCloseBtn(): void {
        this.onThemeBtn();
    }

    onDiceTabBtn(): void {
        this.mainTab = 'LudoSkin';
        this.ludoSkinTab = 'Dice';
        this.render();
    }

    onTokenTabBtn(): void {
        this.mainTab = 'LudoSkin';
        this.ludoSkinTab = 'Token';
        this.render();
    }

    onBubbleTabBtn(): void {
        this.mainTab = 'LudoSkin';
        this.ludoSkinTab = 'Bubble';
        this.render();
    }

    onThemeTabBtn(): void {
        this.mainTab = 'LudoSkin';
        this.ludoSkinTab = 'Theme';
        this.render();
    }

    onBasicThemeTabBtn(): void {
        this.mainTab = 'Theme';
        this.themeTab = 'Basic';
        this.render();
    }

    onRoyalThemeTabBtn(): void {
        this.mainTab = 'Theme';
        this.themeTab = 'Royal';
        this.render();
    }

    onRoomThemeTabBtn(): void {
        this.mainTab = 'Mine';
        this.mineTab = 'Room';
        this.render();
    }

    onProfileThemeTabBtn(): void {
        this.mainTab = 'Mine';
        this.mineTab = 'Profile';
        this.render();
    }

    onBidToggleBtn(): void {
        if (this.bidPanel) this.bidPanel.active = !this.bidPanel.active;
    }

    private render(): void {
        const set = (node: Node | null, active: boolean) => {
            if (node) node.active = active;
        };

        set(this.ludoSkinPanel, this.mainTab === 'LudoSkin');
        set(this.stickerPanel, this.mainTab === 'Sticker');
        set(this.profileCardPanel, this.mainTab === 'ProfileCard');
        set(this.themePanel, this.mainTab === 'Theme');
        set(this.pinOnTopPanel, this.mainTab === 'PinOnTop');
        set(this.royalVehiclePanel, this.mainTab === 'RoyalVehicle');
        set(this.entryEffectsPanel, this.mainTab === 'EntryEffects');
        set(this.minePanel, this.mainTab === 'Mine');

        const isLudoSkin = this.mainTab === 'LudoSkin';
        set(this.diceTabPanel, isLudoSkin && this.ludoSkinTab === 'Dice');
        set(this.diceTabSelectedBG, isLudoSkin && this.ludoSkinTab === 'Dice');
        set(this.tokenTabPanel, isLudoSkin && this.ludoSkinTab === 'Token');
        set(this.tokenTabSelectedBG, isLudoSkin && this.ludoSkinTab === 'Token');
        set(this.bubbleTabPanel, isLudoSkin && this.ludoSkinTab === 'Bubble');
        set(this.bubbleTabSelectedBG, isLudoSkin && this.ludoSkinTab === 'Bubble');
        set(this.themeTabPanel, isLudoSkin && this.ludoSkinTab === 'Theme');
        set(this.themeTabSelectedBG, isLudoSkin && this.ludoSkinTab === 'Theme');

        const isTheme = this.mainTab === 'Theme';
        set(this.basicThemeTabPanel, isTheme && this.themeTab === 'Basic');
        set(this.basicThemeTabSelectedBG, isTheme && this.themeTab === 'Basic');
        set(this.royalThemeTabPanel, isTheme && this.themeTab === 'Royal');
        set(this.royalThemeTabSelectedBG, isTheme && this.themeTab === 'Royal');

        const isMine = this.mainTab === 'Mine';
        set(this.roomThemeTabPanel, isMine && this.mineTab === 'Room');
        set(this.roomThemeTabSelectedBG, isMine && this.mineTab === 'Room');
        set(this.profileThemeTabPanel, isMine && this.mineTab === 'Profile');
        set(this.profileThemeTabSelectedBG, isMine && this.mineTab === 'Profile');
    }
}
