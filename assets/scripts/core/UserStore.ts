import { Store } from './Store';

/**
 * Mirrors UserDetailsModel.Root (Assets/Scripts/Models/UserDetailsModel.cs)
 * field-for-field, since it's the server's actual response shape for
 * "user_details" and this project doesn't own the backend contract.
 */
export interface UserDetails {
    userId: string;
    uniqueGameId: string;
    name: string;
    profilePic: string;
    country: string;
    coins: number;
    gems: number;
    level: number;
    currentLeague: string;
    highestLeague: string;
    winRatio: number;
    badges: string[];
    totalGames: number;
}

/** Replaces Assets/Scripts/Static/UserDataCache.cs. */
export const UserStore = new Store<UserDetails>();
