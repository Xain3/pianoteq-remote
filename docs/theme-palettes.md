# Theme palettes

Open **Appearance** in the application footer to choose a preset or edit its colours.
Colour pickers and `#RRGGBB` inputs apply changes immediately. Each preset retains its
own edits; **Reset this preset** restores its original colours.

The presets are:

| Preset              | Supplied palette                                      | Starting appearance                                         |
| ------------------- | ----------------------------------------------------- | ----------------------------------------------------------- |
| Current             | Existing cream, sage and forest colours               | Original interface                                          |
| Muted Green         | `#989DA6`, `#242526`, `#267302`, `#D9B596`, `#F2F2F2` | Light canvas, dark text, green accents and beige selections |
| Muted Olive & Coral | `#989DA6`, `#242526`, `#618C03`, `#D9B596`, `#F25252` | Charcoal canvas, beige text, olive accents and coral errors |

The attached Adobe Color images provide the five source colours for the two new
presets. Intermediate shades are derived for panels, secondary text, borders and
interaction states. Eight base interface colours are editable. Button text is
chosen automatically for contrast; the editor keeps its own text readable while
the application changes. The contrast display describes main text on panels.

The selected preset and colour overrides are saved in browser local storage under
`pianoteq-remote.theme.v1`. These preferences stay on that browser/device and require
no Pianoteq or server connection. If storage is unavailable, changes last for the
current session. Invalid stored data falls back to the current preset.

Implementation lives in `apps/frontend/src/features/themes`. Preset definitions,
colour math, validation, persistence, CSS variable application and controls have
separate files. Existing instrument controls consume the same CSS variables.
