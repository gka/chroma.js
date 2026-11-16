---
'chroma-js': patch
---

Fix `css('oklab')` and `css('oklch')` rounding a/b and chroma to 2 decimals instead of 3, which made the CSS string a visibly different color (e.g. `#d4090e` parsed back as `#d31100`)
