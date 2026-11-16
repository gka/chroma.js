---
"chroma-js": patch
---

Accept all CSS angle units for the hue in `hsl()`, `lch()` and `oklch()` strings. The CSS parser only knew `deg`, so `chroma('hsl(0.5turn 100% 50%)')`, `chroma('lch(50% 30 1rad)')` and `chroma('oklch(60% 0.15 200grad)')` threw `unknown format`, and `chroma.valid()` returned `false` for them. `grad`, `rad` and `turn` hues are now converted to degrees, as CSS Color 4 does.
