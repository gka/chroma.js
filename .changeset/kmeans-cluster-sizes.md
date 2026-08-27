---
"chroma-js": patch
---

Fix `chroma.limits(data, 'k', n)` (k-means) dropping clusters. The cluster tally was incremented inside the nearest-centroid loop, so each point was counted up to `n` times against intermediate best-so-far indices, corrupting the centroid means. It is now counted once per point after the argmin, so well-separated data yields the expected breaks (`chroma.limits([0,1,2,50,51,52,100,101,102], 'k', 3)` returns `[0, 2, 52, 102]`).
