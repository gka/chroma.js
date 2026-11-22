---
'chroma-js': patch
---

Stop accepting `hs(…)` as a legacy `hsl(…)` CSS color: the legacy hsl pattern made the trailing `l` optional, so e.g. `chroma('hs(0, 100%, 50%)')` was parsed as red
