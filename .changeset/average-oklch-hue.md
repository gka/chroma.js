---
'chroma-js': patch
---

Fix `chroma.average(colors, 'oklch')` averaging the hue as a plain number instead of around the color wheel, so `average(['#ff0000', '#ff00ff'], 'oklch')` returned teal (`#00c596`) instead of a pinkish red
