# Clubs

- **Root node name**: `Clubs`
- **Reached from**: Home ("Clubs" button), Events ("Clubs" button), Friends ("Clubs" button)
- **Script**: `ClubsScreenController`
- **Layout reference**: `docs/layout-specs/clubs.md`

### Labels
None.

### Panel Nodes — main tabs (mutually exclusive)
| Field | Purpose |
|---|---|
| Explore Tab Panel / Explore Tab Selected BG | Explore tab (default on open) |
| Hot Tab Panel / Hot Tab Selected BG | Hot tab |
| My Clubs Tab Panel / My Club Selected BG | My Clubs tab |

### Panel Nodes — My Clubs' sub-tabs (only shown while My Clubs tab is active)
| Field | Purpose |
|---|---|
| My Clubs Recently Tab Panel / …Selected BG | Recently sub-tab (default) |
| My Clubs Joined Tab Panel / …Selected BG | Joined sub-tab |
| My Clubs Following Tab Panel / …Selected BG | Following sub-tab |
| My Clubs Friends Tab Panel / …Selected BG | Friends sub-tab |

### Other fields
| Field | Purpose |
|---|---|
| Create My Room BG | the "create room" confirmation popup — hidden after a room is created |
| Spawn My Club Recently Prefab | a prefab (drag `assets/prefabs/MyClubRecentlyEntry.prefab` once you've made one — see note below) instantiated into the list when a room is created |
| Content Parent | the ScrollView's Content node — where the spawned club entry gets added as a child |

**Note on Spawn My Club Recently Prefab**: this needs its own small prefab (a single list-row entry showing a club's name/icon) — build a simple Node with a Label + Sprite, turn it into a prefab the normal way, then drag that prefab into this field. Not covered in the generic recipe since it's not mounted via `NavigationManager` — it's spawned directly by `ClubsScreenController.spawnClub()` into a scrolling list instead.

### Buttons
| Button | Click Event method | Effect |
|---|---|---|
| Home | `onHomeBtn` | back to Home |
| Events | `onEventsBtn` | go to Events |
| Friends | `onFriendsBtn` | go to Friends |
| Profile Page | `onProfilePageBtn` | go to Profile |
| Explore Tab | `onExploreTabBtn` | switch to Explore tab |
| Hot Tab | `onHotTabBtn` | switch to Hot tab |
| My Clubs Tab | `onMyClubsTabBtn` | switch to My Clubs tab |
| Recently Tab | `onRecentlyTabBtn` | My Clubs → Recently |
| Joined Tab | `onJoinedTabBtn` | My Clubs → Joined |
| Following Tab | `onFollowingTabBtn` | My Clubs → Following |
| Friends Tab *(a different button from the "Friends" nav button above — this one is My Clubs' own Friends sub-tab)* | `onFriendsTabBtn` | My Clubs → Friends sub-tab |
| Gifts Leaderboard | `onGiftsLeaderboardBtn` | go to Gifts |
| Clubs Enter | `onClubsEnterBtn` | go to ClubsMain (enter a club) |
| Create Room | `onCreateRoomBtn` | creates a club, goes to ClubsMain, hides Create My Room BG |

**Deliberate fix vs. the original**: in the original Unity scene, clicking Explore or Hot could leave a leftover "My Clubs" sub-panel visible underneath (almost certainly a bug, not intentional — see the comment at the top of `ClubsScreenController.ts`). This port only shows My Clubs' sub-tabs while My Clubs itself is the active tab. If that turns out to be wrong (i.e. the original behavior actually was intentional), it's a one-line change in `render()`.
