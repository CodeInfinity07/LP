# Native plugin templates (Facebook login)

Source for the native login bridge described in Phase 2 of the port plan. These are **templates to be merged into Cocos Creator's generated native projects**, not files Creator will pick up automatically by being present here.

| File | Merges into |
|---|---|
| `android/AndroidManifest.fragment.xml` | Generated `AndroidManifest.xml` |
| `android/build.gradle.fragment` | Generated app-level `build.gradle` |
| `android/FacebookLoginBridge.kt` | Generated native Android project's Java/Kotlin source tree |
| `ios/Podfile.fragment.rb` | Generated `Podfile` |
| `ios/Info.plist.fragment.xml` | Generated `Info.plist` |
| `ios/FacebookLoginBridge.mm` | Generated native iOS Xcode project source tree |

**Status: unverified.** No Cocos Creator installation exists in the environment these were written in, so:
- The exact merge mechanism (Creator 3.8's `build-templates/` overlay folder vs. hand-editing the generated `native/engine/<platform>/` project directly) needs confirming once Creator is installed - both exist in different Creator versions.
- `JsbBridge` (Android) / `JsbBridgeWrapper` (iOS) method names in the two `FacebookLoginBridge` files match the documented Cocos Creator 3.8 API at time of writing, not a tested integration.
- App ID (`1787730748457941`) and Client Token (`bf296f448fbfc4962475033174a1376e`) are the real values from the Unity project's shipped `Assets/Plugins/Android/AndroidManifest.xml` - same Facebook app, ported as-is, not placeholders.

Do this verification as the first step of Phase 2 implementation, before writing any more code against these templates.
