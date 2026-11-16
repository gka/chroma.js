---
"chroma-js": patch
---

Keep OKLab and OKLCh conversions on D65 when the Lab white point changes. After `chroma.setLabWhitePoint('d50')`, `chroma('#7654cd').oklab()` and `chroma.oklab(...)` previously used D50-adapted XYZ; they now give the same result as with the default white point.
