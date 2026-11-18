---
'chroma-js': patch
---

Fix `scale.correctLightness()` on scales with an uneven domain (more stops than two, not matching the colors): the domain mapping was applied twice, so the lightness drifted far from linear.
