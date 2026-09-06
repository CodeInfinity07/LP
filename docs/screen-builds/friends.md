# Friends

- **Root node name**: `Friends`
- **Reached from**: Home ("Friends" button), Events ("Friends" button), Clubs ("Friends" button)
- **Script**: `FriendsScreenController`
- **Layout reference**: `docs/layout-specs/friends.md`

### Labels
None.

### Panel Nodes — tabs (mutually exclusive)
| Field | Purpose |
|---|---|
| Face Book Friends Tab Panel / Facebook Friends Tab Selected BG | Facebook Friends tab |
| Game Friends Tab Panel / Game Friends Tab Selected BG | Game Friends tab |
| Messages Tab Panel / Messages Tab Selected BG | Messages tab |
| Recent Tab Panel / Recent Tab Selected BG | Recent tab |

### Panel Nodes — independent toggles
| Field | Purpose |
|---|---|
| Game Friend Request Panel | add-friend request popup |
| Friend Request Messages Panel | friend-request messages popup |

### Buttons
| Button | Click Event method | Effect |
|---|---|---|
| Home | `onHomeBtn` | back to Home |
| Events | `onEventsBtn` | go to Events |
| Clubs | `onClubsBtn` | go to Clubs |
| Facebook Friends Tab | `onFacebookFriendsTabBtn` | switch to Facebook Friends tab |
| Game Friends Tab | `onGameFriendsTabBtn` | switch to Game Friends tab |
| Messages Tab | `onMessagesTabBtn` | switch to Messages tab |
| Recent Tab | `onRecentTabBtn` | switch to Recent tab |
| Add Game Friend Request Toggle | `onAddGameFriendRequestToggleBtn` | show/hide Game Friend Request Panel |
| Friend Requests Messages Toggle | `onFriendRequestsMessagesToggleBtn` | show/hide Friend Request Messages Panel |
