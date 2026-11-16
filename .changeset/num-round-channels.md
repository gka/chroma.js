---
"chroma-js": patch
---

Fix `color.num()` for colors with fractional RGB channels, such as colors from scales, `mix()` or `chroma.lab()`. The channels were not rounded, so `num()` could return a non-integer and disagree with `hex()`. For example, `chroma.scale(['white', 'red'])(0.5).num()` returned `16744319.5` while `hex()` returned `'#ff8080'`. The channels are now rounded first, so `num()` returns `0xff8080`, matching `hex()`.
