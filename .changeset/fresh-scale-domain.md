---
"chroma-js": patch
---

Clear cached colors and nonlinear mapping when a scale's domain changes, so reusing a scale produces the same colors as a fresh scale with the new domain.
