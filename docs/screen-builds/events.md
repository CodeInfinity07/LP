# Events

- **Root node name**: `Events`
- **Reached from**: Home ("Events" button), Friends ("Events" button), Clubs ("Events" button)
- **Script**: `EventsScreenController`
- **Layout reference**: `docs/layout-specs/events.md`

### Labels
| Field | Purpose |
|---|---|
| Total Coins Label | coin count |
| Total Gems Label | gem count |

### Panel Nodes (independent toggles)
| Field | Purpose |
|---|---|
| Free Reward Panel | Free Rewards section |
| Gold Chest Panel | Gold Chest section |
| Daily Task Panel | Daily Task section |
| Arrival Chest Panel | Arrival Chest section |
| Level Reward Panel | Level Reward section |
| Basic Info Panel | Basic Info section |

### Buttons
| Button | Click Event method | Effect |
|---|---|---|
| Home | `onHomeBtn` | back to Home |
| Friends | `onFriendsBtn` | go to Friends |
| Clubs | `onClubsBtn` | go to Clubs |
| VIP Subscription | `onVIPSubscriptionBtn` | go to Shop (pop from Shop returns here automatically) |
| Free Rewards Toggle | `onFreeRewardsToggleBtn` | show/hide Free Reward Panel |
| Gold Chest Toggle | `onGoldChestToggleBtn` | show/hide Gold Chest Panel |
| Daily Task Toggle | `onDailyTaskToggleBtn` | show/hide Daily Task Panel |
| Arrival Chest Toggle | `onArrivalChestToggleBtn` | show/hide Arrival Chest Panel |
| Level Reward Toggle | `onLevelRewardToggleBtn` | show/hide Level Reward Panel |
| Basic Info Toggle | `onBasicInfoToggleBtn` | show/hide Basic Info Panel |
