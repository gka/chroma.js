# Chroma.js

Chroma.js is a tiny JavaScript library (8.5kB) for all kinds of color conversions and color scales.

### Usage

In most cases you want to use **chroma.js** to map your data to decent colors, so let's jump to the color scales right away. Here's the basic API:

    // initiate and manipulate colors
    chroma.color('#D4F880').darker().hex();  // #9BC04B
    
    // create easy color scales
    scale = chroma.scale(['white', 'red']);
    scale(0.5).hex(); // #FF7F7F
        
    // Lab interpolation looks better than than RGB
    chroma.scale(['white', 'red']).mode('lab');

    // custom domains, distinct set of colors
    chroma.scale(['#f8f8f8', '#900']).domain([200, 1000], 7);
    
    // Color Brewer! Quantiles!
    chroma.scale('RdYlBu').domain(myValues, 7, 'quantiles');    

    // Even log scales
    chroma.scale(['lightyellow', 'navy']).domain([1, 100000], 7, 'log');    

Like it? Why not dive into the [API docs](https://github.com/gka/chroma.js/blob/master/doc/api.md) (quite short actually).

Download [chroma.min.js](https://raw.github.com/gka/chroma.js/master/chroma.min.js) right away, or use in node.js via

    npm install chroma-js


### Similar Libraries / Prior Art

* [Chromatist](https://github.com/jrus/chromatist)
* [GrapeFruit](http://code.google.com/p/grapefruit/) (Python)
* [colors.py](https://github.com/mattrobenolt/colors.py) (Python)
* [d3.js](https://github.com/mbostock/d3)


### Author

Chroma.js is written by [Gregor Aisch](http://driven-by-data.net).

### License

Released under [BSD license](http://opensource.org/licenses/BSD-3-Clause).
Versions prior to 0.4 were released under [GPL](http://www.gnu.org/licenses/gpl-3.0).

### Known issues

* HSI color conversion (experimental) produces weird results sometimes