# AccountCenter

- **Root node name**: `AccountCenter`
- **Reached from**: Splash (automatic, after 1 second)
- **Script**: `AccountCenterScreenController`
- **Layout reference**: `docs/layout-specs/splash.md` (search within it for "Account Center")

### Labels
None.

### Buttons
| Button | Click Event method | Effect |
|---|---|---|
| Game Exit | `onGameExitBtn` | intentionally does nothing (matches the original — there's no real "quit" concept on mobile) |
| Bind Facebook | `onBindFacebookBtn` | pushes Loading, attempts real Facebook login (see `native/FacebookAuthService.ts`), goes to Home on success or back on failure/cancel |

**Important**: the "Bind Facebook" button drives the real native Facebook login flow — this only actually works in a native Android/iOS build with the native bridge wired up (see `native-templates/`), not in browser Preview. In Preview, clicking it will just fail gracefully (see `FacebookNative.ts`'s "not available" fallback) — that's expected, not a bug, until you're testing on a real device build.
