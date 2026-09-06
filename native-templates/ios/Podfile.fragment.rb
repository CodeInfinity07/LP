# Merge into the Cocos Creator-generated iOS Podfile via the build-templates
# mechanism (confirm exact merge point in Phase 0).
#
# Version left unpinned here (unlike the Android fragment) since CocoaPods
# resolves to latest-compatible by default and the Unity project's iOS FB
# plugin folder (Assets/FacebookSDK/Plugins/iOS) doesn't pin a specific
# version either - pin an exact version once Phase 2 implementation starts,
# per the port plan's "recommend current stable rather than matching
# Unity's dated 17.0.2" note.

pod 'FBSDKLoginKit'
pod 'FBSDKCoreKit'
