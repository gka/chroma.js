---
"chroma-js": patch
---

Reject non-numeric RGB channels instead of silently treating them as `0`. `chroma('nonsense', 0, 255, 'rgb')` and `chroma(null, 0, 255, 'rgb')` now throw `invalid rgb color`, as do `NaN` channels or alpha. Out-of-range numbers are still clipped as before.
