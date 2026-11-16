---
'chroma-js': patch
---

Fix `scale().domain([max, min]).classes(n)` ignoring the reversed domain, so the classified scale returned the same colors as the forward one
