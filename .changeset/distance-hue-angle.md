---
'chroma-js': patch
---

Fix `chroma.distance(a, b, mode)` treating the hue as a plain number in modes with a hue channel (`hsl`, `hsv`, `hsi`, `hcg`, `hcl`, `lch`, `oklch`), so two reds on either side of hue 0 (`#ff0000` and `#ff0001`) were 359.8 apart in `hsl` instead of 0.2
