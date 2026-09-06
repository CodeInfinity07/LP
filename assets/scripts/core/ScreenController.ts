import { Component } from 'cc';

/**
 * Base class every screen controller extends (Profile, Home, Clubs, etc).
 * Replaces Unity's per-screen Controller MonoBehaviours (e.g. ProfileController.cs),
 * which had no shared lifecycle contract and relied on GameManager.ChangeState()
 * blanket-toggling every panel's GameObject.SetActive() from the outside.
 */
export abstract class ScreenController<TParams = void> extends Component {
    /** Called by NavigationManager right after the screen's prefab is mounted. */
    onEnter(_params: TParams): void {
        // default no-op, override as needed
    }

    /** Called by NavigationManager right before the screen's prefab is unmounted. */
    onExit(): void {
        // default no-op, override as needed
    }

    /**
     * Called by NavigationManager when the Android hardware back button fires
     * (or an in-UI back/close button routes through NavigationManager.pop()).
     * Return true to indicate this screen fully handled the back action itself
     * (e.g. closed a modal within the screen) so NavigationManager should NOT
     * pop the stack. Return false (the default) to let NavigationManager pop
     * normally.
     *
     * This did not exist at all in the Unity source - back navigation was
     * faked per-screen by reading static bools on unrelated UIManagers
     * (e.g. ProfileController.CloseBtn() branching on ClubsUIManager.isExploreTab /
     * isHotTab / isMyClubsTab / isClubProfilePage). NavigationManager's real
     * stack replaces that pattern entirely.
     */
    onBackPressed(): boolean {
        return false;
    }
}
