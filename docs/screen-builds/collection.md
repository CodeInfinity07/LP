# Collection

- **Root node name**: `Collection`
- **Reached from**: Home ("Collection" button)
- **Script**: `CollectionScreenController`
- **Layout reference**: `docs/layout-specs/collection-main.md`, plus one file per tab: `collection-ludoskin.md`, `collection-theme.md`, `collection-sticker.md`, `collection-pinontop.md`, `collection-royalvehicle.md`, `collection-entryeffects.md`, `collection-mine.md`, `collection-profilebackground.md`

**Biggest/most complex screen in the project** — take it slow, build one tab at a time and test after each.

### Labels
| Field | Purpose |
|---|---|
| Sticker Total Coins Label | coin count (shown on the Sticker tab specifically) |
| Total Gems Labels *(array — set its size to match how many gem-count displays appear across tabs in the original scene, then drag one Label into each slot)* | gem count, repeated across multiple tabs |

### Panel Nodes — main tabs (mutually exclusive — only one visible at a time)
| Field | Purpose |
|---|---|
| Ludo Skin Panel | Ludo Skin tab content |
| Sticker Panel | Sticker tab content |
| Profile Card Panel | Profile Card tab content |
| Theme Panel | Theme tab content |
| Pin On Top Panel | Pin On Top tab content |
| Royal Vehicle Panel | Royal Vehicle tab content |
| Entry Effects Panel | Entry Effects tab content |
| Mine Panel | Mine tab content |

### Panel Nodes — Ludo Skin's own sub-tabs
| Field | Purpose |
|---|---|
| Dice Tab Panel / Dice Tab Selected BG | Dice sub-tab |
| Token Tab Panel / Token Tab Selected BG | Token sub-tab |
| Bubble Tab Panel / Bubble Tab Selected BG | Bubble sub-tab |
| Theme Tab Panel / Theme Tab Selected BG | Theme sub-tab (nested inside Ludo Skin, distinct from the main Theme tab above) |

### Panel Nodes — Theme's own sub-tabs
| Field | Purpose |
|---|---|
| Basic Theme Tab Panel / Basic Theme Tab Selected BG | Basic sub-tab |
| Royal Theme Tab Panel / Royal Theme Tab Selected BG | Royal sub-tab |

### Panel Nodes — Mine's own sub-tabs
| Field | Purpose |
|---|---|
| Room Theme Tab Panel / Room Theme Tab Selected BG | Room sub-tab |
| Profile Theme Tab Panel / Profile Theme Tab Selected BG | Profile sub-tab |

### Other
| Field | Purpose |
|---|---|
| Bid Panel | independent toggle, unrelated to the tabs above |

### Buttons
| Button | Click Event method | Effect |
|---|---|---|
| Home | `onHomeBtn` | back to Home |
| Close | `onCloseBtn` | close whichever tab is open, back to the hub view |
| Ludo Skin | `onLudoSkinBtn` | open Ludo Skin tab (defaults to Dice sub-tab) |
| Sticker | `onStickerBtn` | open Sticker tab |
| Profile Card | `onProfileCardBtn` | open Profile Card tab |
| Theme | `onThemeBtn` | open Theme tab (defaults to Basic sub-tab) |
| Pin On Top | `onPinOnTopBtn` | open Pin On Top tab |
| Royal Vehicle | `onRoyalVehicleBtn` | open Royal Vehicle tab |
| Entry Effects | `onEntryEffectsBtn` | open Entry Effects tab |
| Mine | `onMineBtn` | open Mine tab (defaults to Room sub-tab) |
| Mine Close | `onMineCloseBtn` | same as clicking Theme |
| Dice Tab | `onDiceTabBtn` | Ludo Skin → Dice sub-tab |
| Token Tab | `onTokenTabBtn` | Ludo Skin → Token sub-tab |
| Bubble Tab | `onBubbleTabBtn` | Ludo Skin → Bubble sub-tab |
| Theme Tab | `onThemeTabBtn` | Ludo Skin → Theme sub-tab |
| Basic Theme Tab | `onBasicThemeTabBtn` | Theme → Basic sub-tab |
| Royal Theme Tab | `onRoyalThemeTabBtn` | Theme → Royal sub-tab |
| Room Theme Tab | `onRoomThemeTabBtn` | Mine → Room sub-tab |
| Profile Theme Tab | `onProfileThemeTabBtn` | Mine → Profile sub-tab |
| Bid Toggle | `onBidToggleBtn` | show/hide Bid Panel |
