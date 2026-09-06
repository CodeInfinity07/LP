# Splash

- **Root node name**: `Splash`
- **Reached from**: `Bootstrap` (should be the actual first screen once you point `Bootstrap.startScreen` at it instead of `Home`)
- **Script**: `SplashScreenController`
- **Layout reference**: `docs/layout-specs/splash.md` (this file also covers AccountCenter and Loading — all three are nested panels inside one Unity scene originally, search within it for the section you need)

### Labels
None.

### Buttons
None.

This screen has no interactive elements — it just waits 1 second, then automatically replaces itself with AccountCenter. Build the visual (logo/background) to match the art, attach the script, no field wiring needed at all.
