# Home

**Status: already built** (per the guided punch-list earlier). Kept here for reference/consistency with the other screens.

- **Root node name**: `Home`
- **Reached from**: pushed automatically by `Bootstrap` on app start (or `AccountCenterScreenController`/`SplashScreenController` once those are wired into the real flow).
- **Script**: `HomeScreenController`
- **Layout reference**: `docs/layout-specs/home.md`

### Labels
| Field | Purpose |
|---|---|
| Total Coins Label | coin count, e.g. "72.24k" |
| Total Gems Label | gem count, e.g. "45.84k" |

### Buttons
| Button | Click Event method | Goes to |
|---|---|---|
| Profile | `onProfileBtn` | Profile |
| Shop | `onShopBtn` | Shop |
| Setting | `onSettingBtn` | Setting |
| Leaderboard *(named "Position Btn" in the original art/scene — see layout-specs)* | `onLeaderboardBtn` | Leaderboard |
| Collection | `onCollectionBtn` | Collection |
| Single Matches | `onSingleMatchesBtn` | SingleMatches |
| Tournament | `onTournamentBtn` | Tournament |
| VIP Room | `onVIPRoomBtn` | VIPRoom |
| Events | `onEventsBtn` | Events |
| Friends | `onFriendsBtn` | Friends |
| Clubs | `onClubsBtn` | Clubs |
