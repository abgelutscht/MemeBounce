# Publish MemeBounce on GitHub

## Repository

Create a public repository named `MemeBounce`. Upload the project files, including the `MemeSense/dist` folder, `src`, `build.py`, `preview.py`, and `README.md`. Keep the dotfiles `.gitignore` and `.github` as well. The project is already a local Git repository; do not upload the `.git` directory or extract the release ZIP into the repository root.

The Source URL on the LiquidBounce resource form is the repository's normal page URL, for example `https://github.com/YOUR-USERNAME/MemeBounce`.

## Release

Once the repository exists, open Releases → Draft a new release. Create tag `v1.0.1` targeting the branch containing the theme. Use `MemeBounce 1.0.1` as the title. Attach `MemeSense.zip` as a release asset and publish the release.

Suggested release notes:

```markdown
MemeSense-inspired theme for LiquidBounce.

- Dark ClickGUI with a compact sidebar and two columns of settings
- Searchable in-page module selector for Minecraft's embedded browser
- Red checkboxes and HUD accent, gray sliders, and rainbow top edge
- Native module toggles, keybind editor, HUD editor, and global settings

Based on the BeautifyV2 runtime; original attribution and license notices retained.
```

`MemeSense.zip` is the installable theme. GitHub's automatically generated source archives contain the whole project and are different files.

The included GitHub Actions workflow rebuilds and validates the ZIP on pushes and pull requests. Release publication is kept manual.
