# CocosClient

Cocos Creator (TypeScript) rewrite of the Unity lobby/meta shell in `../Assets`, plus the Ludo board gameplay that never existed in the Unity project. See `../plan` reference below for full context.

## Status

All six phases of the port plan have an initial pass:

- **Phase 0/1** - project scaffolding + core app-shell (`assets/scripts/core/`): navigation stack, typed socket layer, typed stores, config, persistence.
- **Phase 2** - Facebook native login bridge (`assets/scripts/native/`, `native-templates/`) - see `native-templates/README.md` for what's unverified there and why.
- **Phase 3** - all 15 lobby screens (`assets/scripts/screens/`), each with a header comment naming the Unity controller/manager it replaces.
- **Phase 4** - Clubs (`assets/scripts/screens/clubs/`), including one flagged behavioral fix (see `ClubsScreenController.ts`'s header comment) worth confirming with the team.
- **Phase 5** - Ludo gameplay, built fresh (`assets/scripts/game/`): rules engine, board layout, local (bot) and networked transports, board/dice rendering. The networked transport's wire protocol is proposed, not implemented server-side yet.
- **Phase 6** - build/signing prep, see `docs/BUILD.md`. No actual build has been produced (no Creator/SDK/Xcode installed here).

Nothing has been run - Cocos Creator itself (the desktop editor) isn't installed in this environment and can't be installed headlessly, it's a GUI application you download from cocos.com - and nothing has been tested against the backend, which is currently offline. This is all written directly as source files against the same contract/behavior observed in the Unity project, ready to open in Creator and start testing once both are available.

**Backend note:** the server this client talks to (`Config.ts` -> `207.244.225.100:3050`) is currently offline. Everything here is built to the same event/endpoint contract observed in the Unity source (`SocketManager.cs`, `FaceBookManager.cs`) so it will work once the server is back up, but nothing has been tested against a live connection yet.

## To open this project

1. Install Cocos Creator 3.8.x from https://www.cocos.com/creator-download (pinned version is in `package.json`'s `"creator"` field).
2. Open Cocos Creator, "Open Project", point it at this `CocosClient/` folder. First open will generate `library/`, `temp/`, `settings/` etc. automatically - those are gitignored, don't hand-create them.
3. Run `npm install` inside `CocosClient/` to pull in `socket.io-client` (used by `core/SocketService.ts`).

## Layout

- `assets/scripts/core/` - navigation, networking, typed data stores, config, persistence (Phase 1)
- `assets/scripts/screens/<feature>/` - one folder per lobby screen (Phase 3)
- `assets/scripts/clubs/` - Clubs feature (Phase 4)
- `assets/scripts/game/` - Ludo gameplay, built fresh, no Unity equivalent exists (Phase 5)
- `assets/scripts/native/` - platform bridge wrappers (Facebook login, Phase 2)

Every file under `core/` has a comment at the top naming the Unity file it replaces and what was deliberately changed vs. carried forward - check those comments before modifying, they explain *why* the shape differs from the C# source.
