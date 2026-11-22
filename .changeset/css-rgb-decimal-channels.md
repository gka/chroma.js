---
'chroma-js': patch
---

Accept non-integer channel values in CSS `rgb()`/`rgba()` colors, e.g. `rgb(127.5 0 0)` or `rgb(255.0, 0, 0)`, which CSS allows but were rejected with `unknown format`
