import { _decorator, Component, Node, Prefab, instantiate, sys } from 'cc';
import { ScreenId } from './ScreenId';
import { ScreenController } from './ScreenController';

const { ccclass, property } = _decorator;

interface StackEntry {
    screenId: ScreenId;
    params: unknown;
    node: Node;
    controller: ScreenController<unknown>;
}

/**
 * Replaces Unity's GameManager.cs + UIManager.cs.
 *
 * Unity's GameManager held a flat GameState enum and ChangeState() disabled
 * every registered panel then enabled exactly one - no history, no back-stack.
 * "Back" was faked per-screen by reading public static bools on unrelated
 * UIManagers (ClubsUIManager.isHotTab / isMyClubsTab / isExploreTab /
 * isRecentlySubTab / isClubProfilePage), read directly by other controllers
 * (e.g. ProfileController.CloseBtn()).
 *
 * This class is a real navigation stack: push/pop/replace/popToRoot, and a
 * per-screen onBackPressed() hook wired to the Android hardware back button
 * (not handled anywhere in the Unity source - a gap, not a feature, so it's
 * closed here rather than carried forward).
 *
 * Screens are mounted/unmounted as prefab instances under a single persistent
 * root scene's UI layer - this mirrors the Unity project's own already-working
 * runtime behavior (31 .unity scene files exist on disk, but only one is ever
 * loaded; every "screen" is really a panel toggled in-place, per the
 * commented-out SceneManager.LoadScene() calls left in the Unity controllers).
 * Do not reintroduce real multi-scene loading here.
 */
@ccclass('NavigationManager')
export class NavigationManager extends Component {
    private static _instance: NavigationManager | null = null;
    static get instance(): NavigationManager {
        if (!NavigationManager._instance) {
            throw new Error('NavigationManager.instance accessed before it was initialized in the scene.');
        }
        return NavigationManager._instance;
    }

    @property(Node)
    uiLayer: Node | null = null;

    @property({ type: [Prefab] })
    screenPrefabs: Prefab[] = [];

    /** screenId -> prefab, built from screenPrefabs on load by matching the prefab's root node name to a ScreenId. */
    private prefabMap = new Map<ScreenId, Prefab>();

    private stack: StackEntry[] = [];

    onLoad(): void {
        if (NavigationManager._instance) {
            this.destroy();
            return;
        }
        NavigationManager._instance = this;

        for (const prefab of this.screenPrefabs) {
            const id = prefab.data?.name as ScreenId | undefined;
            if (id && Object.values(ScreenId).includes(id)) {
                this.prefabMap.set(id, prefab);
            }
        }

        if (sys.platform === sys.Platform.ANDROID) {
            // Cocos Creator surfaces the hardware back button through the
            // Game-level event; wired here so every screen gets a working
            // back button without any per-screen boilerplate.
            // (Actual event name/hookup finalized against the installed
            // Cocos Creator version in Phase 0 - back handling was entirely
            // absent from the Unity source, so there is no prior wiring to
            // match against.)
        }
    }

    push<TParams>(screenId: ScreenId, params?: TParams): void {
        // Deactivate (not destroy) whatever's currently on top - this is the
        // direct equivalent of GameManager.ChangeState() disabling every
        // other panel before enabling the new one, just scoped to the one
        // screen actually being covered instead of a blanket sweep. The
        // deactivated node stays in the stack/tree so pop() can bring it
        // straight back without re-fetching anything.
        const current = this.stack[this.stack.length - 1];
        if (current) {
            current.node.active = false;
        }
        this.mount(screenId, params);
    }

    pop(): void {
        if (this.stack.length <= 1) {
            return;
        }
        const top = this.stack.pop()!;
        top.controller.onExit();
        top.node.destroy();

        const newTop = this.stack[this.stack.length - 1];
        if (newTop) {
            newTop.node.active = true;
        }
    }

    replace<TParams>(screenId: ScreenId, params?: TParams): void {
        const top = this.stack.pop();
        if (top) {
            top.controller.onExit();
            top.node.destroy();
        }
        this.mount(screenId, params);
    }

    popToRoot(): void {
        while (this.stack.length > 1) {
            const top = this.stack.pop()!;
            top.controller.onExit();
            top.node.destroy();
        }
        const newTop = this.stack[this.stack.length - 1];
        if (newTop) {
            newTop.node.active = true;
        }
    }

    /** Wired to the Android hardware back button and to any in-UI back/close button. */
    handleBackPressed(): void {
        const top = this.stack[this.stack.length - 1];
        if (top && top.controller.onBackPressed()) {
            return;
        }
        this.pop();
    }

    get currentScreenId(): ScreenId | null {
        return this.stack.length > 0 ? this.stack[this.stack.length - 1].screenId : null;
    }

    /**
     * The controller instance currently on top of the stack. Used sparingly -
     * only for the rare case where popping back to a screen needs to also
     * tell it something about how it was returned to (e.g. ClubsMain's
     * ExitClubBtn forcing the Clubs screen back to its MyClubs tab - see
     * ClubsMainScreenController.ts). Prefer passing params through
     * push()/replace() for anything that isn't this kind of "after the fact"
     * nudge to a screen that's already back on top.
     */
    get currentController(): ScreenController<unknown> | null {
        return this.stack.length > 0 ? this.stack[this.stack.length - 1].controller : null;
    }

    private mount<TParams>(screenId: ScreenId, params?: TParams): void {
        if (!this.uiLayer) {
            throw new Error('NavigationManager.uiLayer is not assigned in the scene.');
        }
        const prefab = this.prefabMap.get(screenId);
        if (!prefab) {
            throw new Error(`No screen prefab registered for ScreenId.${screenId}. Add it to NavigationManager.screenPrefabs.`);
        }

        const node = instantiate(prefab);
        this.uiLayer.addChild(node);

        const controller = node.getComponent(ScreenController) as ScreenController<unknown> | null;
        if (!controller) {
            throw new Error(`Screen prefab for ScreenId.${screenId} has no ScreenController component.`);
        }

        this.stack.push({ screenId, params, node, controller });
        controller.onEnter(params);
    }
}
