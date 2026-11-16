---
"chroma-js": patch
---

Accept `rgb()` and `rgba()`, and `hsl()` and `hsla()`, as aliases in the legacy comma-separated CSS syntax, as CSS Color 4 does. `rgb(0, 51, 255, 0.5)`, `rgba(0, 51, 255)`, `hsl(120, 100%, 50%, 0.5)` and `hsla(120, 100%, 50%)` were rejected. Legacy `hsla()` now also accepts a `deg` hue and a percentage or out-of-range alpha (`hsla(120deg, 100%, 50%, 50%)`), like legacy `rgba()` and the modern syntax. The `hsl` pattern no longer matches the misspelled `hs(...)`.
