---
'chroma-js': patch
---

Autodetect CSS colors regardless of case and surrounding whitespace: `chroma('RGB(255, 0, 0)')`, `chroma('TRANSPARENT')` and `chroma(' hsl(0, 100%, 50%) ')` threw `unknown format` (and `chroma.valid()` returned `false`) although `chroma.css()` parses them
