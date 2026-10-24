---
"chroma-js": patch
---

Fix scales with a `gamma()` throwing for values outside the domain. `chroma.scale('YlGn').domain([5, 15]).gamma(1.2)(4)` previously threw an error; out-of-domain values are now clamped to the nearest end of the scale, as they are without a gamma.
