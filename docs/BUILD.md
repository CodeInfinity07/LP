# Build & Signing (Phase 6)

Status: documentation/config only - no build has actually been produced. This environment has no Cocos Creator install, no Android SDK/NDK, no Xcode, so nothing here has been executed, only prepared. Treat every step below as unverified until someone runs it with Creator actually installed.

## Package identity

Pulled from the Unity project's `ProjectSettings/ProjectSettings.asset`:
- **Android applicationId**: `com.abovemax.malikalludo` (explicit override, `AndroidBundleVersionCode: 1`, `AndroidMinSdkVersion: 22`) - this is the identity the app would already be published under if it ever shipped. **Use this exact applicationId in the Cocos Creator Android build panel** to preserve Play Store update continuity if a listing exists under it; only pick a different one if starting a deliberately fresh listing (confirm with whoever owns the Play Console account before deciding).
- **iOS bundle identifier**: nothing was ever configured in the Unity project (no `iPhone` entry under `applicationIdentifier`, only a `buildNumber: iPhone: 0` placeholder) - iOS was evidently never actually set up to ship. No continuity constraint here; recommend mirroring the Android id (`com.abovemax.malikalludo`) for consistency unless there's a reason not to.
- **Product name**: `Malik Al-Ludo` (`productName` in ProjectSettings.asset).
- **Min SDK**: Android 22 (Lollipop 5.0) in the Unity project - re-confirm this is still an acceptable floor before copying it forward; it's from whenever that setting was last touched, not a deliberate Phase 6 decision.

## Android

1. Wire `Keystore/malikalludo.keystore` (repo root, one level up from `CocosClient/`) into Cocos Creator's Android build panel: keystore path, alias, store password, key password. **Passwords are not in this repo** - retrieve them from whoever generated the keystore or wherever they're stored (a secrets manager, a teammate). If they're unrecoverable, a new keystore has to be generated, which breaks update continuity with any existing Play Store listing under the old one - confirm this is understood before treating a lost password as "just regenerate it."
2. Merge `native-templates/android/AndroidManifest.fragment.xml` and `native-templates/android/build.gradle.fragment` into the generated native Android project - see `native-templates/README.md` for the merge-mechanism caveat (unverified against an installed Creator instance).
3. Confirm target Android API level compliance for whatever Play Store's current minimum target API requirement is at build time (this moves roughly yearly - don't assume the Unity project's old settings are still compliant).
4. Build a release AAB (Play Store) or APK (sideload testing), install on a **real device** - Facebook's native login callback-activity flow doesn't fully exercise correctly on emulators.
5. If publishing to Play: fill out the Data Safety form declaring Facebook login's personal-data collection (name, email, profile picture - see `assets/scripts/native/FacebookAuthService.ts`).

## iOS

1. Apple Developer account access, bundle identifier (see above), provisioning profile - set up in Phase 0, needed continuously through development, not just at ship time.
2. Merge `native-templates/ios/Info.plist.fragment.xml` and `native-templates/ios/Podfile.fragment.rb` into the generated Xcode project.
3. Xcode archive + distribution signing (no artifact to reuse from the Unity side here - iOS was never actually configured there, see above).
4. TestFlight build for on-device Facebook login testing (iOS's native handoff to the Facebook app/Safari differs from Android's).
5. App Store Connect privacy nutrition label for Facebook login data. Per the recommendation in `native-templates/android/AndroidManifest.fragment.xml` (disabling `AutoLogAppEventsEnabled`/`AdvertiserIDCollectionEnabled`), an App Tracking Transparency prompt can likely be skipped entirely - confirm that recommendation was actually followed before assuming no ATT prompt is needed.

## Cross-cutting, before calling Phase 6 done

- Confirm `socket.io-client` (via `core/SocketService.ts`) holds a reliable connection on real native Android/iOS builds - flagged as a risk since Phase 1 (Unity used a dedicated native Socket.IO package for this specific reliability reason). Untestable right now since the backend at `207.244.225.100:3050` is offline - do this as the first real-device test once it's back up.
- Full regression pass through every Phase 3/4/5 screen on real devices, both platforms, before considering this phase complete.
