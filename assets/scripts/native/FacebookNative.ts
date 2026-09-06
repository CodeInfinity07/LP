import { sys } from 'cc';

/**
 * Thin wrapper around Cocos Creator's native JS<->native bridge (the `jsb`
 * global, only defined in native builds - not web/editor-preview). Talks to
 * native-templates/android/FacebookLoginBridge.kt and
 * native-templates/ios/FacebookLoginBridge.mm.
 *
 * NOTE: the exact bridge API name/shape (`jsb.bridge.callNative` /
 * `onNative` below) matches the documented Cocos Creator 3.8 JsbBridge
 * convention at time of writing, but hasn't been verified against an
 * actually-installed Creator instance yet (none is installed in this
 * environment) - confirm and adjust in Phase 0/2 once a real native build
 * exists to test against.
 *
 * Only the native login handshake goes through this bridge. Everything
 * after an access token is obtained (Graph API calls, POSTing to the
 * backend, token storage, opening the socket) is plain TypeScript in
 * FacebookAuthService.ts - there is no reason to push that across the
 * bridge too.
 */

declare const jsb: {
    bridge: {
        callNative(command: string): void;
        onNative: ((eventName: string, arg: string) => void) | null;
    };
};

export interface FacebookLoginResult {
    status: 'success' | 'cancelled' | 'error';
    accessToken?: string;
    message?: string;
}

const LOGIN_RESULT_EVENT = 'FacebookLoginResult';

class FacebookNativeImpl {
    private pendingLogin: ((result: FacebookLoginResult) => void) | null = null;

    private get isNativeAvailable(): boolean {
        return (sys.platform === sys.Platform.ANDROID || sys.platform === sys.Platform.IOS) && typeof jsb !== 'undefined';
    }

    login(): Promise<FacebookLoginResult> {
        if (!this.isNativeAvailable) {
            // Editor preview / web build: no native FB SDK to call into.
            // See the port plan's documented fallback (a WebView-driven FB
            // OAuth redirect flow) if a browser-based path is ever needed
            // for a non-native target - not implemented here since native
            // login is the primary path for both shipped platforms.
            return Promise.resolve({ status: 'error', message: 'Facebook native login is only available on Android/iOS builds.' });
        }

        return new Promise((resolve) => {
            this.pendingLogin = resolve;
            jsb.bridge.onNative = (eventName: string, arg: string) => {
                if (eventName !== LOGIN_RESULT_EVENT) {
                    return;
                }
                const result = JSON.parse(arg) as FacebookLoginResult;
                this.pendingLogin?.(result);
                this.pendingLogin = null;
            };
            jsb.bridge.callNative('login');
        });
    }

    logout(): void {
        if (!this.isNativeAvailable) {
            return;
        }
        jsb.bridge.callNative('logout');
    }
}

export const FacebookNative = new FacebookNativeImpl();
