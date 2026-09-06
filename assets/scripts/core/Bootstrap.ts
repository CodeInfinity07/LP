import { _decorator, Component, Enum } from 'cc';
import { NavigationManager } from './NavigationManager';
import { ScreenId } from './ScreenId';
import { UserStore } from './UserStore';

const { ccclass, property } = _decorator;

/**
 * Attach to one empty node in the root scene (separate from the
 * NavigationManager node, to keep "how the app starts" out of the
 * navigation stack's own logic). Pushes the first screen once
 * NavigationManager has registered its prefabs.
 *
 * Real startup order (once Splash/AccountCenter/Loading screens are built)
 * should push ScreenId.Splash here instead - startScreen defaults to Home
 * only so the very first screen you assemble has something to point at
 * without needing the rest of the flow built first.
 */
@ccclass('Bootstrap')
export class Bootstrap extends Component {
    @property({ type: Enum(ScreenId) })
    startScreen: ScreenId = ScreenId.Home;

    /**
     * The backend at 207.244.225.100:3050 is offline (see core/Config.ts) -
     * with it unreachable, UserStore never receives real "user_details" data,
     * so anything bound to it (e.g. HomeScreenController's coin/gem labels)
     * stays blank. Toggle this on while testing screens standalone; turn it
     * off once testing against a live/staging backend.
     */
    @property
    seedFakeUserData = true;

    start(): void {
        if (this.seedFakeUserData) {
            UserStore.set({
                userId: 'test-user',
                uniqueGameId: 'TEST-0001',
                name: 'Test Player',
                profilePic: '',
                country: 'PK',
                coins: 1_250_000,
                gems: 340,
                level: 12,
                currentLeague: 'Gold',
                highestLeague: 'Platinum',
                winRatio: 0.63,
                badges: [],
                totalGames: 87,
            });
        }

        NavigationManager.instance.push(this.startScreen);
    }
}
