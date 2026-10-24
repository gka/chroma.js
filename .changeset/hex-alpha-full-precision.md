---
"chroma-js": patch
---

Preserve full alpha precision when parsing `#rrggbbaa` / `#rgba` hex colors. `hex2rgb` rounded the alpha channel to two decimals, so 136 of 256 alpha bytes did not round-trip (for example `chroma('#ff000088').hex()` returned `#ff000087`). Alpha is now parsed exactly as `aa / 255`, matching the RGB channels and CSS Color 4.
