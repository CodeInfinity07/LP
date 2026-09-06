# Screen build checklists

Read `docs/BUILDING_SCREENS.md` first — it's the one detailed "how do I actually click through this in the editor" guide. Every file below just lists what's specific to that one screen (which Labels/Buttons/Panels it needs, and which script method each button wires to); come back to `BUILDING_SCREENS.md` for the mechanical steps.

Suggested build order (roughly easiest-to-hardest, and grouped by what's reached from what):

1. [home.md](home.md) *(done)*
2. [profile.md](profile.md) *(done)*
3. [setting.md](setting.md) — no fields, one button, good warm-up
4. [viproom.md](viproom.md) — no fields, one button
5. [shop.md](shop.md)
6. [singlematches.md](singlematches.md)
7. [tournament.md](tournament.md)
8. [events.md](events.md)
9. [friends.md](friends.md)
10. [clubs.md](clubs.md)
11. [clubsmain.md](clubsmain.md)
12. [gifts.md](gifts.md)
13. [leaderboard.md](leaderboard.md)
14. [collection.md](collection.md) — biggest/most complex, save for last
15. [splash.md](splash.md)
16. [accountcenter.md](accountcenter.md)
17. [loading.md](loading.md)

Not covered here: the **Match** (gameplay board) screen — it's a different kind of build (dynamic pawn/dice rendering driven by code, not a static laid-out screen) and deserves its own separate walkthrough once you're ready for it. See `game/MatchScreenController.ts` in the meantime.
