// Placement: once Cocos Creator generates its native iOS project (build
// once in Creator to get native/engine/ios/... created), this file (plus a
// matching .h) goes into that Xcode project's source tree - exact path and
// the JsbBridgeWrapper header import path depend on the installed Creator
// version (confirm in Phase 0; the class/method names below match the
// documented Cocos Creator 3.8 native bridge API at time of writing but
// should be verified against the actual generated project).
//
// Replaces the native-login half of Assets/Scripts/Managers/FaceBookManager.cs
// on iOS (FB.LogInWithReadPermissions + AccessToken.CurrentAccessToken.TokenString).
// Everything after the access token is obtained (Graph API profile fetch,
// POST to backend /auth, storing server_auth_token, opening the socket) is
// plain TypeScript - see assets/scripts/native/FacebookAuthService.ts.

#import <FBSDKLoginKit/FBSDKLoginKit.h>
#import <UIKit/UIKit.h>
#import "platform/ios/JsbBridgeWrapper-ios.h"

static NSString *const kFacebookLoginCommandEvent = @"FacebookLoginCommand";
static NSString *const kFacebookLoginResultEvent = @"FacebookLoginResult";

@interface FacebookLoginBridge : NSObject
+ (void)registerBridge;
@end

@implementation FacebookLoginBridge

+ (void)registerBridge {
    [[JsbBridgeWrapper sharedInstance] addScriptEventListener:kFacebookLoginCommandEvent
                                                      callback:^(NSString *arg) {
        if ([arg isEqualToString:@"login"]) {
            [self doLogin];
        } else if ([arg isEqualToString:@"logout"]) {
            [self doLogout];
        }
    }];
}

+ (void)doLogin {
    if ([FBSDKAccessToken currentAccessToken] != nil && ![[FBSDKAccessToken currentAccessToken] isExpired]) {
        // already logged in - matches Unity FaceBookManager.Login()'s FB.IsLoggedIn guard.
        [self sendResultWithStatus:@"success"
                        accessToken:[FBSDKAccessToken currentAccessToken].tokenString
                              error:nil];
        return;
    }

    FBSDKLoginManager *loginManager = [[FBSDKLoginManager alloc] init];
    UIViewController *rootVC = [UIApplication sharedApplication].delegate.window.rootViewController;

    [loginManager logInWithPermissions:@[ @"public_profile", @"email" ]
                     fromViewController:rootVC
                                 handler:^(FBSDKLoginManagerLoginResult *result, NSError *error) {
        if (error) {
            [self sendResultWithStatus:@"error" accessToken:nil error:error.localizedDescription];
        } else if (result.isCancelled) {
            [self sendResultWithStatus:@"cancelled" accessToken:nil error:nil];
        } else {
            [self sendResultWithStatus:@"success" accessToken:result.token.tokenString error:nil];
        }
    }];
}

+ (void)doLogout {
    FBSDKLoginManager *loginManager = [[FBSDKLoginManager alloc] init];
    [loginManager logOut];
}

+ (void)sendResultWithStatus:(NSString *)status accessToken:(NSString *)accessToken error:(NSString *)errorMessage {
    NSMutableDictionary *json = [NSMutableDictionary dictionary];
    json[@"status"] = status;
    if (accessToken) {
        json[@"accessToken"] = accessToken;
    }
    if (errorMessage) {
        json[@"message"] = errorMessage;
    }
    NSData *data = [NSJSONSerialization dataWithJSONObject:json options:0 error:nil];
    NSString *jsonString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    [[JsbBridgeWrapper sharedInstance] dispatchEventToScript:kFacebookLoginResultEvent arg:jsonString];
}

@end

/*
 * AppDelegate integration (Cocos Creator's generated native iOS entry point):
 *
 *   - (BOOL)application:(UIApplication *)application
 *       didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
 *       ... existing Cocos boilerplate ...
 *       [FacebookLoginBridge registerBridge];
 *       [[FBSDKApplicationDelegate sharedInstance] application:application
 *                                  didFinishLaunchingWithOptions:launchOptions];
 *       return YES;
 *   }
 *
 *   - (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary *)options {
 *       return [[FBSDKApplicationDelegate sharedInstance] application:app openURL:url options:options];
 *   }
 */
