# Loading

- **Root node name**: `Loading`
- **Reached from**: AccountCenter ("Bind Facebook" button, while login is in progress)
- **Script**: `LoadingScreenController`
- **Layout reference**: `docs/layout-specs/splash.md` (search within it for "Loading")

### Fields (not a Label or Button — a plain Node and a number)
| Field | Purpose |
|---|---|
| Loader Rotate BG | the spinning background graphic — drag in a Sprite/Node that has the spinner image |
| Rotate Speed | a plain number field (not a Node) — type in a value like `90` (degrees per second); higher = faster spin |

### Buttons
None — this screen has no interaction, it just spins while login happens in the background and gets replaced automatically.
