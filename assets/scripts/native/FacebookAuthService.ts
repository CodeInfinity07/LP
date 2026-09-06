import { Config } from '../core/Config';
import { AuthTokenStorage } from '../core/AuthTokenStorage';
import { SocketService } from '../core/SocketService';
import { FacebookNative } from './FacebookNative';

/**
 * Orchestrates the full login flow, replacing
 * Assets/Scripts/Managers/FaceBookManager.cs end-to-end:
 *
 *   1. native FB login (public_profile + email)               -> FacebookNative.login()
 *   2. Graph API profile fetch (/me?fields=id,first_name,last_name,email)
 *   3. Graph API picture fetch (/me/picture?redirect=false&type=large)
 *   4. POST the FB access token to the backend's /auth endpoint
 *   5. store the returned server_auth_token, open the authenticated socket
 *
 * Deliberately not ported:
 *  - the commented-out AutoLogin() path in FaceBookManager.cs (PlayerPrefs
 *    FB_userId/FB_firstUserName/FB_lastUserName/FB_userProfilePic) - that
 *    code was already dead in the Unity source (never called from Awake()),
 *    so there is no live behavior to replicate. Only server_auth_token
 *    persists across sessions (AuthTokenStorage.ts).
 *  - the "email" Graph API field is requested (matching the Unity fields
 *    list) but the Unity code never actually reads userData["email"] out of
 *    the response either - kept in the request for parity, still unused
 *    here too. Flag to product/backend if email actually needs to reach the
 *    server; today neither client sends it anywhere.
 *
 * NOTE: the backend at Config.authEndpoint is currently offline - this
 * entire flow is untested against a live server. Structure matches the
 * observed contract (POST form field "token", raw-text response body IS the
 * server_auth_token - not JSON, confirmed from FaceBookManager.cs's
 * SendFacebookToken using request.downloadHandler.text directly).
 */

export interface FacebookProfile {
    id: string;
    firstName: string;
    lastName: string;
    pictureUrl?: string;
}

export interface FacebookAuthResult {
    success: boolean;
    cancelled?: boolean;
    error?: string;
    profile?: FacebookProfile;
    serverAuthToken?: string;
}

class FacebookAuthServiceImpl {
    async login(): Promise<FacebookAuthResult> {
        const loginResult = await FacebookNative.login();

        if (loginResult.status === 'cancelled') {
            return { success: false, cancelled: true };
        }
        if (loginResult.status === 'error' || !loginResult.accessToken) {
            return { success: false, error: loginResult.message ?? 'Facebook login failed.' };
        }

        const accessToken = loginResult.accessToken;

        const [profile, serverAuthToken] = await Promise.all([
            this.fetchProfile(accessToken),
            this.exchangeTokenWithBackend(accessToken),
        ]);

        if (!serverAuthToken) {
            return { success: false, error: 'Backend token exchange failed.', profile };
        }

        AuthTokenStorage.set(serverAuthToken);
        SocketService.connectWithToken(serverAuthToken);

        return { success: true, profile, serverAuthToken };
    }

    logout(): void {
        FacebookNative.logout();
        AuthTokenStorage.clear();
        SocketService.disconnect();
    }

    /** Reconnects using a previously stored server_auth_token, skipping the FB login step entirely. */
    async resumeSession(): Promise<boolean> {
        const token = AuthTokenStorage.get();
        if (!token) {
            return false;
        }
        SocketService.connectWithToken(token);
        return true;
    }

    private async fetchProfile(accessToken: string): Promise<FacebookProfile | undefined> {
        try {
            const meResponse = await fetch(
                `https://graph.facebook.com/me?fields=id,first_name,last_name,email&access_token=${encodeURIComponent(accessToken)}`
            );
            const me = (await meResponse.json()) as { id: string; first_name: string; last_name: string };

            const pictureResponse = await fetch(
                `https://graph.facebook.com/me/picture?redirect=false&type=large&access_token=${encodeURIComponent(accessToken)}`
            );
            const picture = (await pictureResponse.json()) as { data?: { url?: string } };

            return {
                id: me.id,
                firstName: me.first_name,
                lastName: me.last_name,
                pictureUrl: picture.data?.url,
            };
        } catch (err) {
            console.error('[FacebookAuthService] profile fetch failed:', err);
            return undefined;
        }
    }

    private async exchangeTokenWithBackend(accessToken: string): Promise<string | undefined> {
        try {
            const form = new URLSearchParams();
            form.set('token', accessToken);

            const response = await fetch(Config.authEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: form.toString(),
            });

            if (!response.ok) {
                console.error('[FacebookAuthService] /auth returned', response.status);
                return undefined;
            }

            // Response body IS the token as raw text, not a JSON envelope -
            // matches request.downloadHandler.text used directly in
            // FaceBookManager.cs's SendFacebookToken().
            return await response.text();
        } catch (err) {
            console.error('[FacebookAuthService] /auth request failed (backend may be offline):', err);
            return undefined;
        }
    }
}

export const FacebookAuthService = new FacebookAuthServiceImpl();
