# How to build any screen (read this first)

Every screen in this project is built the same way — this doc is the one detailed generic recipe. The per-screen checklists in `docs/screen-builds/` just tell you *which* Labels/Buttons/Nodes a specific screen needs and what to name them — for every mechanical "how do I actually do that in the editor" step, come back here.

If you haven't already, do Home and Profile first using this doc side-by-side with `docs/screen-builds/home.md` and `docs/screen-builds/profile.md` — they're the two simplest screens and the best way to learn this flow before tackling the bigger ones.

## The building blocks

Every screen node needs, in order:

### 1. Create the screen's root node
- In the **Hierarchy** panel, right-click your `Canvas` node → **Create → Empty Node**.
- Rename it (double-click the name, or press F2) to **exactly** match the screen's `ScreenId` — e.g. `Shop`, `Setting`, `Leaderboard`. Capitalization matters, it must match exactly what's in `core/ScreenId.ts`. The per-screen doc tells you the exact name to use.

### 2. Add a Label (for any text that needs to change at runtime — coins, gems, names, etc.)
- Right-click the screen's root node → **Create → UI Component → Label**.
- Rename it something you'll recognize (e.g. `CoinsLabel`) — this name is just for your own Hierarchy organization, it doesn't need to match anything in code.
- Select it, in the **Inspector** find the **Label** component's **String** field, type a placeholder (e.g. `0`) — it'll be overwritten at runtime by the script.

### 3. Add a Button (for anything clickable)
- Right-click the screen's root node → **Create → UI Component → Button**.
- Rename it to describe what it does (e.g. `CloseBtn`).
- It comes with a child Label automatically — double-click that child and change its text to something readable ("Close", "X", etc.) so you can see it during testing.

### 4. Add a plain Node (for a panel/section that just needs to show/hide — no text, no button, just something a script turns on/off)
- Right-click the screen's root node (or a Button/Label if it's nested inside one) → **Create → Empty Node**, or **Create → UI Component → Sprite** if it should show a background image.
- Rename it to match what it represents (e.g. `FreeRewardPanel`).

### 5. Attach the screen's script
- Select the screen's **root node** (the one from step 1).
- In the **Inspector**, click **Add Component** → type the controller's class name (e.g. `ShopScreenController`) → select it.
- The Inspector now shows one empty field per `@property` in that script — Labels, Nodes, and so on, named to match (Cocos auto-converts `totalCoinsLabel` to a readable **Total Coins Label** in the Inspector).

### 6. Wire each field
- Drag each Label/Node/Button you created in steps 2-4 from the **Hierarchy** panel into its matching empty field in the script's Inspector section.
- The per-screen doc tells you exactly which field each element maps to.

### 7. Wire each button's click event
For every Button on the screen:
- Select it → Inspector → **Button** component → **Click Events** section → click **+**.
- Drag the screen's **root node** (not the button itself) into the new slot's node field.
- Click the dropdown next to it → pick the controller class → pick the specific method for that button (the per-screen doc tells you exactly which method).

### 8. Turn it into a prefab
- Drag the screen's root node from the **Hierarchy** panel onto your `assets/prefabs/` folder in the **Assets** panel. This creates `<ScreenName>.prefab` and turns the Hierarchy node into a linked instance of it.

### 9. Register it with NavigationManager
- Select the `NavigationManager` node (should already exist from building Home).
- In its Inspector, find **Screen Prefabs** → click **+** → drag the new prefab into the empty slot.

### 10. Test
- Save (**Ctrl+S**), click **Preview**.
- Navigate to the new screen from whatever screen links to it (per the per-screen doc's "reached from" note).
- Any button whose *target* screen doesn't exist yet will throw `No screen prefab registered for ScreenId.X` in the console — expected, not a bug, until you build that screen too.

## Adding real art (once the screen works functionally)

- The exact image file each element should use, and its approximate position/size, is documented in `docs/layout-specs/<screen>.md` (pulled directly from the original Unity scene).
- The actual image files live in `assets/textures/<screen>/`, prefixed by sub-panel (e.g. `LudoBillionaire - Bg.png`).
- Drag an image from the Assets panel onto a node with a **Sprite** or **Button** component to assign it (Button → **Normal Sprite** in the Inspector; a plain background → add a **Sprite** component to that node first via Add Component, then assign into its **Sprite Frame** field).

## A note on panel-toggle screens (Leaderboard, Collection, Friends, Gifts, Events, Clubs)

Several screens have many `@property(Node)` fields that are just panels toggled on/off by tab buttons (not Labels, not separate screens). These don't need their own prefab or their own entry in `NavigationManager` — they're just child Nodes under the same screen root, built the same way as step 4 above, all sitting inside that one screen's prefab.

## Array-of-Labels fields

`CollectionScreenController.totalGemsLabels` is an **array** field (shows as a list with a size number in the Inspector, not a single slot). Set its **size** to however many gem-count Labels that screen has (per the original Unity source, there were multiple gem displays across Collection's tabs), then drag one Label into each slot.
