# MemeBounce for LiquidBounce

A screenshot-inspired ClickGUI theme with a 700 × 620 dark window, narrow category sidebar, pink square checkboxes, thin gray sliders, two columns of settings, and a rainbow top edge.

## In-game screenshots

Captured in Minecraft singleplayer. Click an image to view it at full resolution.

### ClickGUI

![MemeBounce ClickGUI with red checkboxes, thin sliders, and two columns of module settings](screenshots/clickgui.png?v=protected)

### Searchable module picker

![MemeBounce in-page module dropdown running inside Minecraft](screenshots/module-picker.png?v=protected)

### HUD

![MemeBounce HUD with red module names and matching widget accents during gameplay](screenshots/hud.png?v=protected)

The minimap shown in the gameplay screenshot is a separate mod.

The module dropdown shows real modules in the selected LiquidBounce category. Enable controls the selected module; Bind opens its native keybind editor. Settings save immediately through the reference runtime. HUD Editor and global Settings remain available along the bottom of the screen. Other screens and HUD components use the bundled reference UI with the pink accent.

Version 1.0.1 uses an in-page, searchable module picker for compatibility with Minecraft's embedded browser and overrides the reference HUD's local blue accent with MemeSense red.

## Install

Extract **the contents** of `MemeSense.zip` into:

```text
%APPDATA%\CCBlueX\LiquidLauncher\data\gameDir\nextgen\LiquidBounce\themes\memesense
```

`metadata.json` and `index.html` should be directly inside `memesense`, alongside `assets`, `components`, `fonts`, and `img`.

Restart LiquidBounce, then enter this command in game chat:

```text
.client theme set memesense
```

Use `.client theme list` to check discovery. The client also provides `.client theme reload`. Switch back with `.client theme set liquidbounce`.

Local discovery is based on the [official ThemeManager source](https://github.com/CCBlueX/LiquidBounce/blob/nextgen/src/main/kotlin/net/ccbluex/liquidbounce/integration/theme/ThemeManager.kt). See the [official theme documentation](https://liquidbounce.net/docs/theme-system/overview/) and [client command documentation](https://liquidbounce.net/docs/commands/client).

## Edit and build

Edit `src/memesense.css` and `src/memesense.js`, then run `python build.py` with Python 3. The included `MemeSense.zip` contains the reference runtime and assets. On a fresh checkout, the build extracts it into `MemeSense/dist`, so no local LiquidBounce installation or npm packages are required. It updates the adapter, metadata, and entry page and creates a new `MemeSense.zip` for release.

To refresh the reference runtime explicitly, use `python build.py --reference "PATH/TO/BEAUTIFY/dist"`.

MemeBounce is the repository/marketplace name. The theme currently keeps `memesense` as its internal ID and MemeSense as its in-game display name, so existing installations and the commands above continue to work.

Run `python preview.py` and open `http://127.0.0.1:8765/#/clickgui?static` for a local preview with simulated settings. This server never connects to Minecraft. It is only a preview, not the server to use for playing.

## Validation and credits

Validated JavaScript syntax, theme metadata, packaged assets, rendered layout, category/module selection, and a server-confirmed setting save in a desktop browser. Captured the active theme, working module picker, settings, and red HUD accents in Minecraft singleplayer. Every individual setting type has not been tested.

Runtime, HUD components, fonts, and other assets come from the supplied BeautifyV2 installation by asitnix (marketplace item 581/version 4958), based on CCBlueX's LiquidBounce UI. Original license notices remain in the copied bundle. Upstream source: [BeautifyV2](https://github.com/CCBlueX/LiquidBounce-Theme-BeautifyV2) and [LiquidBounce](https://github.com/CCBlueX/LiquidBounce). The added layout adapter and styles are in `src`. This is an independent recreation inspired by MemeSense, with no affiliation to MemeSense.
