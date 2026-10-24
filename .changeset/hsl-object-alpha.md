---
"chroma-js": patch
---

Keep the alpha channel when constructing a color from an HSL object. `chroma({ h: 120, s: 0.8, l: 0.75, a: 0.5 })` previously returned an opaque color; it now has an alpha of `0.5`, like the RGB object form already did.
