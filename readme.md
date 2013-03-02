# Chroma.js

Chroma.js is a tiny JavaScript library (8.5kB) for all kinds of color conversions and color scales.

### Usage

In most cases you want to use **chroma.js** to map your data to decent colors, so let's jump to the color scales right away. Here's the basic API:

    // create a color scale, returns a function [0,1] --> color
    var f = chroma.scale(['white', 'red']);

    // compute a color within that scale
    f(0.5).hex();  // "#FF7F7F"

You can specify as many colors as you want..

    chroma.scale(['#A50026', '#FFFFBF', '#006837']);

..and customize their positions in the gradient:

    chroma.scale(['#A50026', '#FFFFBF', '#006837'], [0, 0.2, 1]);

You can change input domain from [0,1] to your data:

    var f = chroma.scale(['white', 'red']).domain([0, 1000]);

Choose from a [variety of nice color](https://github.com/gka/chroma.js/wiki/Predefined-Colors) scales by [Cynthia Brewer](http://colorbrewer2.com) using:

    chroma.scale('RdYlGn');



### Documentation

* [Working with Colors](https://github.com/gka/chroma.js/wiki/Colors)
* [Working with Color Scales](https://github.com/gka/chroma.js/wiki/Color-Scales)
* [Supported Color Spaces](https://github.com/gka/chroma.js/wiki/Color-Spaces)
* [Named Colors and ColorBrewer Scales](https://github.com/gka/chroma.js/wiki/Predefined-Colors)

### Similar Libraries

* [Chromatist](https://github.com/jrus/chromatist)
* [GrapeFruit](http://code.google.com/p/grapefruit/) (Python)
* [colors.py](https://github.com/mattrobenolt/colors.py) (Python)
* [d3.js](https://github.com/mbostock/d3)


### Author

Chroma.js is written by [Gregor Aisch](http://driven-by-data.net).

### License

Released under [BSD license](http://opensource.org/licenses/BSD-3-Clause).
Version prior to 0.4 were released under [GPL](http://www.gnu.org/licenses/gpl-3.0).

### Known bugs

* HSI color conversion produces weird results sometimes