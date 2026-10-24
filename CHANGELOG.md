## Changelog

### 3.3.0

- `chroma.blend()` now takes the alpha of both colors into account, compositing the second color over the first (source-over). Previously alpha was discarded, so a transparent top color still changed the result and two translucent colors produced an opaque one. Blending opaque colors gives the same results as before. Results can now be translucent, in which case `hex()` returns eight digits (e.g. `chroma.blend('rgba(0,0,255,0.5)', 'rgba(255,0,0,0.5)', 'normal').hex()` is `'#aa0055bf'`). Also fixes `burn` throwing for a white backdrop with a black source, which now returns white.
- Fix `chroma.average()` in hue-based modes (`hsl`, `hsv`, `lch`, `hcl`, …) depending on the order of the colors. The first color's weight was applied to its hue angle as well as its contribution, and an achromatic first color (e.g. white or gray) was counted as hue 0° (red). For example, `chroma.average(['white', 'blue'], 'hsl')` returned `#df9fdf` instead of `#9f9fdf`.
- Fix hcl/lch/oklch interpolation not reaching pure black/white exactly when interpolating from a saturated color
- Preserve full alpha precision when parsing `#rrggbbaa` / `#rgba` hex colors. `hex2rgb` rounded the alpha channel to two decimals, so 136 of 256 alpha bytes did not round-trip (for example `chroma('#ff000088').hex()` returned `#ff000087`). Alpha is now parsed exactly as `aa / 255`, matching the RGB channels and CSS Color 4.
- Fix the `hcg` color space. `color.hcg()` returned chroma and grayness on a 0–100 scale while `chroma.hcg()` expects 0–1, so converting a color to HCG and back, as well as mixing, averaging or building scales in `hcg` mode, produced black or threw an error. `color.hcg()` now returns chroma and grayness on a 0–1 scale.
- Keep the alpha channel when constructing a color from an HSL object. `chroma({ h: 120, s: 0.8, l: 0.75, a: 0.5 })` previously returned an opaque color; it now has an alpha of `0.5`, like the RGB object form already did.
- Fix `chroma.limits(data, 'k', n)` (k-means) dropping clusters. The cluster tally was incremented inside the nearest-centroid loop, so each point was counted up to `n` times against intermediate best-so-far indices, corrupting the centroid means. It is now counted once per point after the argmin, so well-separated data yields the expected breaks (`chroma.limits([0,1,2,50,51,52,100,101,102], 'k', 3)` returns `[0, 2, 52, 102]`).
- Handle missing LCH lightness as zero when parsing CSS colors.
- Fix parsing of legacy `rgba(r, g, b, a)` CSS colors: percentage alpha (e.g. `rgba(255,0,0,50%)`) was read on the 0–255 channel scale and clamped to 1, and `none` produced `NaN` channels
- Fix alpha being `NaN` for colors constructed without an alpha channel from `oklab`, `oklch` or `gl`
- Reject non-numeric RGB channels instead of silently treating them as `0`. `chroma('nonsense', 0, 255, 'rgb')` and `chroma(null, 0, 255, 'rgb')` now throw `invalid rgb color`, as do `NaN` channels or alpha. Out-of-range numbers are still clipped as before.
- Rename the internal RGB-to-HSV converter from `rgb2hsl` to `rgb2hsv`, so stack traces and debugging show the correct name. No change in behavior.
- Fix `scale.classes(n)` ignoring a later `scale.domain()` call. Class boundaries set with a number are now recomputed when the domain changes, so `.classes(5).domain([-2, 2])` gives the same five colors as `.domain([-2, 2]).classes(5)` instead of only black and white. Explicit class breaks passed as an array are unchanged when the domain changes.
- Fix scales with a `gamma()` throwing for values outside the domain. `chroma.scale('YlGn').domain([5, 15]).gamma(1.2)(4)` previously threw an error; out-of-domain values are now clamped to the nearest end of the scale, as they are without a gamma.
- Preserve opacity when setting an individual color channel.

### 3.2.0

- scale.domain now returns the original domain array when called with no arguments

### 3.1.3

- updated dependencies

### 3.1.2

- fixed a bug in Lch interpolation of hue-less colors

### 3.1.1

- fix: allow deep-imports in vite projects

### 3.1.0

- feat: parse `'transparent'` as black with 0% opacity - resolves [#280](https://github.com/gka/chroma.js/issues/280)
- make it easier to access colorbrewer palette names - resolves [#314](https://github.com/gka/chroma.js/issues/314)
- docs: explain differences to official colorbrewer scales - resolves [#316](https://github.com/gka/chroma.js/issues/316)
- fix: correct parsing of modern css colors with percentage alpha - resolves [#297](https://github.com/gka/chroma.js/issues/297)
- fix: css output for hue-less colors in lch() and oklch() - resolves [#357](https://github.com/gka/chroma.js/issues/357)

### 3.0.0

- 🎉 NEW: Add support for modern CSS color spaces. This means you can now export and parse CSS colors in `lab()`, `lch()`, `oklab()`, `oklch()` space.
- 🎉 NEW: you can now control the standard white reference point for the CIE Lab and CIE Lch color spaces via `setLabWhitePoint`.
- Breaking: `color.css()` will no longer return [legacy CSS colors](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgb#legacy_syntax_comma-separated_values) like `rgb(255, 255, 0)` but use modern CSS colors like `rgb(255 255 0)` instead.
- fix: you can now use chroma.js both via the default export as well as named exports in ES6.
- fix: switch to W3C implementation of OKLab color space

### 2.6.0

- 🎉 NEW: add [`color.shade()`](#color-shade), [`color.tint()`](#color-shade).
- fix: remove false w3c color cornflower

### 2.5.0

- refactored code base to ES6 modules

### 2.4.0

- add support for Oklab and Oklch color spaces

### 2.3.0

- use binom of degree n in chroma.bezier

### 2.2.0

- use Delta e2000 for chroma.deltaE #269

### 2.0.3

- hsl2rgb will, like other x2rgb conversions now set the default alpha to 1

### 2.0.2

- use a more mangle-safe check for Color class constructor to fix issues with uglifyjs and terser

### 2.0.1

- added `chroma.valid()` for checking if a color can be parsed by chroma.js

### 2.0.0

- chroma.js has been ported from CoffeeScript to ES6! This means you can now import parts of chroma in your projects!
- changed HCG input space from [0..360,0..100,0..100] to [0..360,0..1,0..1] (to be in line with HSL)
- added new object unpacking (e.g. `hsl2rgb({h,s,l})`)
- changed default interpolation to `lrgb` in mix/interpolate and average.
- if colors can't be parsed correctly, chroma will now throw Errors instead of silently failing with console.errors

### 1.4.1

- chroma.scale() now interprets `null` as NaN and returns the fallback color. Before it had interpreted `null` as `0`
- added `scale.nodata()` to allow customizing the previously hard-coded fallback (aka "no data") color #cccccc

### 1.4.0

- color.hex() now automatically sets the mode to 'rgba' if the colors alpha channel is < 1. so `chroma('rgba(255,0,0,.5)').hex()` will now return `"#ff000080"` instead of `"#ff0000"`. if this is not what you want, you must explicitly set the mode to `rgb` using `.hex("rgb")`.
- bugfix in chroma.average in LRGB mode ([#187](https://github.com/gka/chroma.js/issues/187))
- chroma.scale now also works with just one color ([#180](https://github.com/gka/chroma.js/issues/180))

### 1.3.5

- added LRGB interpolation

### 1.3.4

- passing _null_ as mode in scale.colors will return chroma objects

### 1.3.3

- added [color.clipped](https://gka.github.io/chroma.js/#color-clipped)
- added [chroma.distance](https://gka.github.io/chroma.js/#chroma-distance)
- added [chroma.deltaE](https://gka.github.io/chroma.js/#chroma-deltae)
- [color.set](https://gka.github.io/chroma.js/#color-set) now returns a new chroma instance
- chroma.scale now allows [disabling of internal cache](https://gka.github.io/chroma.js/#scale-cache)
- [chroma.average](https://gka.github.io/chroma.js/#chroma-average) now works with any color mode
- added unit tests for color conversions
- use hex colors as default string representation
- RGB channels are now stored as floats internally for higher precision
- bugfix with cubehelix and constant lightness
- bugfix in chroma.limits quantiles
- bugfix when running scale.colors(1)
- bugfix in hsi2rgb color conversion

### 1.2.2

- scale.colors() now returns the original colors instead of just min/max range

### 1.2.0

- added chroma.average for averaging colors

### 1.1.0

- refactored chroma.scale
- changed behaviour of scale.domain
- added scale.classes
- added scale.padding

### 1.0.2

- standardized alpha channel construction
- chroma.bezier automatically returns chroma.scale

### 1.0.1

- added simple color output to chroma.scale().colors()

### 1.0.0

- numeric interpolation does what it should
- refactored and modularized code base
- changed argument order of Color::interpolate
