# Tournament

- **Root node name**: `Tournament`
- **Reached from**: Home ("Tournament" button)
- **Script**: `TournamentScreenController`
- **Layout reference**: `docs/layout-specs/tournament.md` (main) and `docs/layout-specs/tournament-stage.md` (the stage sub-panel)

### Labels
| Field | Purpose |
|---|---|
| Total Coins Label | coin count |
| Total Gems Label | gem count |

### Panel Nodes
| Field | Purpose |
|---|---|
| Tournament Stage Panel | the "stage" view — was its own separate Unity scene originally, now just a toggled panel on this same screen |

### Buttons
| Button | Click Event method | Effect |
|---|---|---|
| Home | `onHomeBtn` | back to Home |
| View Toggle | `onViewToggleBtn` | show/hide Tournament Stage Panel |
