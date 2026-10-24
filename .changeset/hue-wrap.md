---
"chroma-js": patch
---

Wrap hues of any size in the HSL, HSV, HSI and HCG conversions. The converters only added or subtracted 360 once, so hues of two turns or more gave wrong colors: `chroma.hsl(780, 1, 0.375)` was black instead of the same olive as `chroma.hsl(60, 1, 0.375)`, `chroma.hsv(780, 1, 0.75)` and `chroma.hcg(780, 1, 0.5)` had `NaN` channels, and `chroma.hsl(-420, 1, 0.375)` was red instead of magenta. This affects hues built up in a loop, such as golden-angle palettes (`chroma.hsl(i * 137.5, 0.6, 0.5)`), and CSS strings such as `hsl(780, 100%, 37.5%)`.
