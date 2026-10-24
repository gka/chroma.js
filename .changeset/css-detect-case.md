---
"chroma-js": patch
---

Detect CSS color strings regardless of case and surrounding whitespace. `chroma.css()` already parsed `RGB(0, 255, 0)`, `HSL(120, 100%, 50%)` and strings with leading or trailing whitespace, but `chroma()` and `chroma.valid()` did not recognize them, so `chroma('RGB(0, 255, 0)')` threw `unknown format`. Function names such as `rgb()`, `hsl()` and `oklch()` and the keyword `transparent` are now matched case-insensitively, as in CSS.
