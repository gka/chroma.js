# 1.3.3

* added [color.clipped](https://gka.github.io/chroma.js/#color-clipped) 
* added [chroma.distance](https://gka.github.io/chroma.js/#chroma-distance)
* added [chroma.deltaE](https://gka.github.io/chroma.js/#chroma-deltae)
* [color.set](https://gka.github.io/chroma.js/#color-set) now returns a new chroma instance
* chroma.scale now allows [disabling of internal cache](https://gka.github.io/chroma.js/#scale-cache)
* [chroma.average](https://gka.github.io/chroma.js/#chroma-average) now works with any color mode
* added unit tests for color conversions
* use hex colors as default string representation
* RGB channels are now stored as floats internally for higher precision
* bugfix with cubehelix and constant lightness
* bugfix in chroma.limits quantiles
* bugfix when running scale.colors(1)
* bugfix in hsi2rgb color conversion

# 1.2.2

* scale.colors() now returns the original colors instead of just min/max range

# 1.2.0

* added chroma.average for averaging colors

# 1.1.0

* refactored chroma.scale
* changed behaviour of scale.domain
* added scale.classes
* added scale.padding

# 1.0.2

* standardized alpha channel construction
* chroma.bezier automatically returns chroma.scale

# 1.0.1

* added simple color output to chroma.scale().colors()

# 1.0.0

* numeric interpolation does what it should
* refactored and modularized code base
* changed argument order of Color::interpolate 
