# ClubsMain

- **Root node name**: `ClubsMain`
- **Reached from**: Clubs ("Clubs Enter" or "Create Room" button)
- **Script**: `ClubsMainScreenController`
- **Layout reference**: `docs/layout-specs/clubsmain.md`

### Labels
| Field | Purpose |
|---|---|
| Club Name Info Label | club name (shown in the main panel) |
| Club Code Label | club code (shown in the info panel) |
| Club Name Label | club name (shown in the info panel — separate Label from the one above, same text) |
| Announcement Label | club announcement text |

### Panel Nodes
| Field | Purpose |
|---|---|
| Club Info Panel | toggled info popup |
| Profile Tab / Profile Tab Selected BG | Profile sub-tab (of the two below) |
| Members Tab / Members Tab Selected BG | Members sub-tab (default) |

### Buttons
| Button | Click Event method | Effect |
|---|---|---|
| Exit Club | `onExitClubBtn` | back to Clubs, and forces Clubs to show its My Clubs tab specifically (a deliberate, preserved behavior — see the script's comment) |
| Club Info Toggle | `onClubInfoToggleBtn` | show/hide Club Info Panel |
| Profile Tab | `onProfileTabBtn` | switch to Profile sub-tab |
| Members Tab | `onMembersTabBtn` | switch to Members sub-tab |

Labels here are populated from live club data (`ClubStore`) — since the backend is offline, they'll stay blank unless you extend `Bootstrap.ts` to also seed fake club data (same pattern as the fake user data it already seeds), or until you're testing against a real/staging backend.
