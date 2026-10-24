---
"chroma-js": patch
---

Rename the internal RGB-to-HSV converter from `rgb2hsl` to `rgb2hsv`, so stack traces and debugging show the correct name. No change in behavior.
