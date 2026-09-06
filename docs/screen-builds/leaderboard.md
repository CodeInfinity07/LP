# Leaderboard

- **Root node name**: `Leaderboard`
- **Reached from**: Home ("Leaderboard"/"Position" button)
- **Script**: `LeaderboardScreenController`
- **Layout reference**: `docs/layout-specs/leaderboard-main.md`, plus one file per sub-panel: `leaderboard-global.md`, `leaderboard-ludobillionaire.md`, `leaderboard-legendstar.md`, `leaderboard-achievementbadge.md`, `leaderboard-uniqueidranking.md`, `leaderboard-friends.md`

### Labels
None.

### Panel Nodes (independent toggles — NOT a tab set; more than one can be open at once, see the note in the script's own comments)
| Field | Purpose |
|---|---|
| Global Panel | global rankings section |
| Ludo Billionaire Panel | Ludo Billionaire leaderboard section |
| Legend Star Panel | Legend Star leaderboard section |
| Achievement Badge Wall Panel | achievement badges section |
| Unique ID Ranking Panel | unique-ID ranking section |
| Friends Panel | friends leaderboard section |
| This Month Panel / This Month Selected BG | shown when "This Month" is selected (only relevant inside Unique ID Ranking) |
| All Time Panel / All Time Selected BG | shown when "All Time" is selected |

### Buttons
| Button | Click Event method | Effect |
|---|---|---|
| Home | `onHomeBtn` | back to Home |
| Global Toggle | `onGlobalToggleBtn` | show/hide Global Panel |
| Ludo Billionaire Toggle | `onLudoBillionaireToggleBtn` | show/hide Ludo Billionaire Panel |
| Legend Star Toggle | `onLegendStarToggleBtn` | show/hide Legend Star Panel |
| Achievement Badge Toggle | `onAchievementBadgeToggleBtn` | show/hide Achievement Badge Wall Panel |
| Unique ID Ranking Toggle | `onUniqueIDRankingToggleBtn` | show/hide Unique ID Ranking Panel, defaults to "This Month" |
| Friends Toggle | `onFriendsToggleBtn` | show/hide Friends Panel |
| This Month | `onThisMonthBtn` | switch to This Month view |
| All Time | `onAllTimeBtn` | switch to All Time view |
