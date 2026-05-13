---
'chroma-js': patch
---

scale.classes(count) now recomputes its breaks against the scale domain, so calling classes() before domain() gives the same result as calling them in the reverse order
