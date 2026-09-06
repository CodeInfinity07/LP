import { sys } from 'cc';

/**
 * Replaces the PlayerPrefs.SetString("server_auth_token", ...) call in
 * Assets/Scripts/Managers/FaceBookManager.cs. This is the only piece of
 * client-side state in the whole Unity source that outlives a single
 * session - everything else (coins, gems, club data) is server-driven and
 * cached only in memory (see Store.ts / UserStore.ts / ClubStore.ts).
 */
const KEY = 'server_auth_token';

export const AuthTokenStorage = {
    get(): string | null {
        try {
            return sys.localStorage.getItem(KEY);
        } catch {
            return null;
        }
    },

    set(token: string): void {
        try {
            sys.localStorage.setItem(KEY, token);
        } catch {
            // storage unavailable (e.g. private browsing in a web build) - not
            // fatal, just means auto-login on relaunch won't work this session.
        }
    },

    clear(): void {
        try {
            sys.localStorage.removeItem(KEY);
        } catch {
            // no-op
        }
    },
};
