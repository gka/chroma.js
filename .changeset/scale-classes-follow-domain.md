---
"chroma-js": patch
---

Fix `scale.classes(n)` ignoring a later `scale.domain()` call. Class boundaries set with a number are now recomputed when the domain changes, so `.classes(5).domain([-2, 2])` gives the same five colors as `.domain([-2, 2]).classes(5)` instead of only black and white. Explicit class breaks passed as an array are unchanged when the domain changes.
