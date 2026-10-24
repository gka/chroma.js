---
'chroma-js': patch
---

Fix parsing of legacy `rgba(r, g, b, a)` CSS colors: percentage alpha (e.g. `rgba(255,0,0,50%)`) was read on the 0–255 channel scale and clamped to 1, and `none` produced `NaN` channels
