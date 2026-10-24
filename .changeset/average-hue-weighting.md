---
"chroma-js": patch
---

Fix `chroma.average()` in hue-based modes (`hsl`, `hsv`, `lch`, `hcl`, …) depending on the order of the colors. The first color's weight was applied to its hue angle as well as its contribution, and an achromatic first color (e.g. white or gray) was counted as hue 0° (red). For example, `chroma.average(['white', 'blue'], 'hsl')` returned `#df9fdf` instead of `#9f9fdf`.
