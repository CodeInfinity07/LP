# Gifts

- **Root node name**: `Gifts`
- **Reached from**: Clubs ("Gifts Leaderboard" button)
- **Script**: `GiftsScreenController`
- **Layout reference**: `docs/layout-specs/gifts.md`

**Largest number of panel fields of any screen** — three main tabs, each with its own period sub-tab. Build and test one main tab fully (all its periods) before starting the next.

### Labels
None.

### Panel Nodes — main tabs (mutually exclusive)
| Field | Purpose |
|---|---|
| Gifts Room Tab Panel / Gifts Room Tab Selected BG | Room tab |
| Gifts Sent Tab Panel / Gifts Sent Tab Selected BG | Sent tab |
| Gifts Received Tab Panel / Gifts Received Tab Selected BG | Received tab |

### Panel Nodes — Room's period sub-tabs
| Field | Purpose |
|---|---|
| Gifts Room Hourly Tab Panel / …Selected BG | Hourly (default when Room tab opens) |
| Gifts Room Daily Tab Panel / …Selected BG | Daily |
| Gifts Room Weekly Tab Panel / …Selected BG | Weekly |
| Gifts Room Monthly Tab Panel / …Selected BG | Monthly |

### Panel Nodes — Sent's period sub-tabs
| Field | Purpose |
|---|---|
| Gifts Sent Daily Tab Panel / Gifts Sent Daily Tab Selected Bg *(note: lowercase "Bg" on this one specifically, matches the script)* | Daily (default when Sent tab opens) |
| Gifts Sent Weekly Tab Panel / …Selected BG | Weekly |
| Gifts Sent Monthly Tab Panel / …Selected BG | Monthly |

### Panel Nodes — Received's period sub-tabs
| Field | Purpose |
|---|---|
| Gifts Received Daily Tab Panel / …Selected BG | Daily (default when Received tab opens) |
| Gifts Received Weekly Tab Panel / …Selected BG | Weekly |
| Gifts Received Monthly Tab Panel / …Selected BG | Monthly |

### Buttons
| Button | Click Event method | Effect |
|---|---|---|
| Close | `onCloseBtn` | back to Clubs |
| Gifts Room Tab | `onGiftsRoomTabBtn` | Room tab, defaults to Hourly |
| Gifts Sent Tab | `onGiftsSentTabBtn` | Sent tab, defaults to Daily |
| Gifts Received Tab | `onGiftsReceivedTabBtn` | Received tab, defaults to Daily |
| Gifts Room Hourly Tab | `onGiftsRoomHourlyTabBtn` | Room → Hourly |
| Gifts Room Daily Tab | `onGiftsRoomDailyTabBtn` | Room → Daily |
| Gifts Room Weekly Tab | `onGiftsRoomWeeklyTabBtn` | Room → Weekly |
| Gifts Room Monthly Tab | `onGiftsRoomMonthlyTabBtn` | Room → Monthly |
| Gifts Sent Daily Tab | `onGiftsSentDailyTabBtn` | Sent → Daily |
| Gifts Sent Weekly Tab | `onGiftsSentWeeklyTabBtn` | Sent → Weekly |
| Gifts Sent Monthly Tab | `onGiftsSentMonthlyTabBtn` | Sent → Monthly |
| Gifts Received Daily Tab | `onGiftsReceivedDailyTabBtn` | Received → Daily |
| Gifts Received Weekly Tab | `onGiftsReceivedWeeklyTabBtn` | Received → Weekly |
| Gifts Received Monthly Tab | `onGiftsReceivedMonthlyTabBtn` | Received → Monthly |
