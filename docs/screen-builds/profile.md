# Profile

**Status: already built** (per the guided punch-list earlier). Kept here for reference/consistency with the other screens.

- **Root node name**: `Profile`
- **Reached from**: Home ("Profile" button), Clubs ("Profile Page" button)
- **Script**: `ProfileScreenController`
- **Layout reference**: `docs/layout-specs/profile.md`

### Labels
| Field | Purpose |
|---|---|
| Profile Name Label | player name |
| Profile Level Label | level number |
| Profile Unique Game Id Label | unique game ID |
| Profile Total Games Label | total games played |
| Profile Current League Label | current league |
| Profile Highest League Label | highest league reached |
| Profile Win Ratio Label | win ratio percentage |

### Buttons
| Button | Click Event method | Goes to |
|---|---|---|
| Close | `onCloseBtn` | back (`NavigationManager.pop()` — returns to wherever Profile was opened from) |
