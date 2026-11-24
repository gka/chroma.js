---
'chroma-js': patch
---

Accept missing alpha (`none`), out-of-range numeric alpha, and trailing whitespace in modern `rgb()`, `hsl()`, `lab()`, `lch()`, `oklab()` and `oklch()` strings. Missing alpha resolves to zero and numeric alpha uses the existing clipping behavior.
