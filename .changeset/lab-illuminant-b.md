---
"chroma-js": patch
---

Fix `chroma.setLabWhitePoint('b')` using the white point of illuminant A, so Lab conversions under B returned the same values as under A. B now uses its own white point (X 0.99072, Z 0.85223).
