---
"chroma-js": minor
---

`chroma.blend()` now takes the alpha of both colors into account, compositing the second color over the first (source-over). Previously alpha was discarded, so a transparent top color still changed the result and two translucent colors produced an opaque one. Blending opaque colors gives the same results as before. Results can now be translucent, in which case `hex()` returns eight digits (e.g. `chroma.blend('rgba(0,0,255,0.5)', 'rgba(255,0,0,0.5)', 'normal').hex()` is `'#aa0055bf'`). Also fixes `burn` throwing for a white backdrop with a black source, which now returns white.
