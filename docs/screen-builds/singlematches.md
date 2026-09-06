# SingleMatches

- **Root node name**: `SingleMatches`
- **Reached from**: Home ("Single Matches" button)
- **Script**: `SingleMatchesScreenController`
- **Layout reference**: `docs/layout-specs/singlematches.md`

### Labels
| Field | Purpose |
|---|---|
| Total Coins Label | coin count |
| Total Gems Label | gem count |

### Buttons
| Button | Click Event method | Effect |
|---|---|---|
| Home | `onHomeBtn` | back to Home |
| Play *(new — no equivalent button existed in the original Unity scene; add one yourself, any label/position is fine)* | `onPlayBtn` | starts a real local match (you + 3 bots) and pushes the Match screen — this is the actual gameplay entry point, see `game/MatchScreenController.ts` |

The "Play" button is the one thing on this screen not pulled from the original design — the original had no working "start match" button at all (the game was never built). Building the `Match` screen itself is a separate, bigger task (see `game/` scripts) — this screen just needs somewhere to launch it from.
