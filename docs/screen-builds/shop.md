# Shop

- **Root node name**: `Shop`
- **Reached from**: Home ("Shop" button), Events ("VIP Subscription" button)
- **Script**: `ShopScreenController`
- **Layout reference**: `docs/layout-specs/shop.md`

### Labels
| Field | Purpose |
|---|---|
| Total Coins Label | coin count |
| Total Gems Label | gem count |

### Buttons
| Button | Click Event method | Goes to |
|---|---|---|
| Close | `onCloseBtn` | back (returns to Home or Events, whichever opened it) |

No IAP/purchase buttons exist in the original — this screen is coin/gem display only for now.
