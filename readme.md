# Chroma.js

[Chroma.js](https://gka.github.io/chroma.js/) is a tiny JavaScript library (14kB) for all kinds of color conversions and color scales.

[![Build Status](https://travis-ci.org/gka/chroma.js.svg?branch=master)](https://travis-ci.org/gka/chroma.js)

### Usage


Initiate and manipulate colors:

```javascript
chroma('#D4F880').darken().hex();  // #9BC04B
```

Working with color scales is easy, too:

```javascript
scale = chroma.scale(['white', 'red']);
scale(0.5).hex(); // #FF7F7F
```

Lab/Lch interpolation looks better than RGB

```javascript
chroma.scale(['white', 'red']).mode('lab');
```

Custom domains! Quantiles! Color Brewer!!

```javascript
chroma.scale('RdYlBu').domain(myValues, 7, 'quantiles');
```

And why not use logarithmic color scales once in your life?

```javascript
chroma.scale(['lightyellow', 'navy']).domain([1, 100000], 7, 'log');
```

### Like it?

Why not dive into the [interactive documentation](http://gka.github.io/chroma.js/) (there's a [static version](https://github.com/gka/chroma.js/blob/v1.3.1/docs/src/index.md), too). You can download [chroma.min.js](https://raw.github.com/gka/chroma.js/master/chroma.min.js) or use the [hosted version on cdnjs.com](https://cdnjs.com/libraries/chroma-js).

You can use it in node.js, too!

    npm install chroma-js

Or you can use it in SASS using [chromatic-sass](https://github.com/bugsnag/chromatic-sass)!

### Build instructions

To compile the coffee-script source files you have to run (might have to ``npm install` first)

    grunt

To run the tests simply run

    npm test

And to update the documentation (thanks!), just do

	npm install --global markdown-to-html http-server
    cd docs/
    make && make preview

### Similar Libraries / Prior Art

* [Chromatist](https://github.com/jrus/chromatist)
* [GrapeFruit](https://github.com/xav/Grapefruit) (Python)
* [colors.py](https://github.com/mattrobenolt/colors.py) (Python)
* [d3.js](https://github.com/mbostock/d3)


### Author

Chroma.js is written by [Gregor Aisch](http://driven-by-data.net).

### License

Released under [BSD license](http://opensource.org/licenses/BSD-3-Clause).
Versions prior to 0.4 were released under [GPL](http://www.gnu.org/licenses/gpl-3.0).

### Further reading

* [How To Avoid Equidistant HSV Colors](https://vis4.net/blog/posts/avoid-equidistant-hsv-colors/)
* [Mastering Multi-hued Color Scales with Chroma.js](https://vis4.net/blog/posts/mastering-multi-hued-color-scales/)
