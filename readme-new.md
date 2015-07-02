
# chroma.js

**chroma.js** is a JavaScript library for dealing with colors!

chroma.js can **read** colors from various formats, **manipulate** them in different ways and finally **output** them in the format you want.

Here's an example for a simple read / manipulate / output chain:

```
chroma('pink').darken(20).hex() // = "#c88a8d"
```

In case you can't read hexadecimal codes (yet), here's what chroma.js did to our pink:

{pink}   {#c88a8d}

Aside from that, chroma.js can also help you **generate nice colors** using various methods, for instance to be used in color palette for maps or data visualizations.

```js
var scale = chroma.scale(['white','green','blue']).out('hex')
[0,0.25,0.5,0.75,1].map(scale)
```

chroma.js has a lot more to offer, but that's the basic gist of it.

## Reading colors from various formats

The first step is to get your color into chroma.js. That's what the ``chroma()`` function does.

```js
chroma('pink')          // from a named color
chroma(255,0,0)         // from r,g,b
chroma('#ff0000')       // from hex string
chroma(0xff0000)        // from hex number
chroma('rgb(255,0,0)')  // from css color string
```

But that's not all. chroma.js can read colors in various different color spaces.

```
chroma.hsl(60, 1, 0.5)  // hue,saturation,lightness)
chroma.hsv(60,1,0.5)    // hue,saturation,value)
chroma.cmyk(1,0,0.5,1)  // cyan,magenta,yellow,black)
chroma.lab(0.5, 30, 60) // lightness,A*,B*
chroma.hcl(60, 1, 0.6)  // hue,chroma,lightness
```

chroma.js generally accepts a variety to input APIs, mainly because I couldn't decide which one I like best. Use whatever you want.

```
chroma.hsl(60, 1, 0.5)    // one argument per channel
chroma.hsl([60, 1, 0.5])  // all channels as single array
chroma(60, 1, 0.5, 'hsl') // passing mode as last parameter
```

## manipulating colors

Once loaded, chroma.js can change colors. One way we already saw above, you can change the lightness.

```
color.darken()      // make color darker
color.darken(30)    // make color even darker
color.brighten()    // make color brighter
```

You can also saturate and desaturate colors:

```
color.saturate()      // make color more saturated
color.desaturate(30)  // make color less saturated
```

Or you can mix a color with another color:

```
chroma('blue').mix('red').hex()  // "7f007f"
```

If you want to ensure a color has a certain

```
color.luminance(20)
```



## mixing colors

```js
chroma.mix('red', 'blue').hex()  // 'purple'
chroma.mix('red', 'blue', 0.25).hex()  // 'purple'
chroma.mix('red', 'blue', 0.75).hex()  // 'purple'
chroma.mix('red', 'blue', 0.5, 'lab')  // mix in Lab space
```

## darken/brighten colors

```js
chroma('red').darken().hex() //
chroma('red').brighten().hex() //
```

## blending colors

```js
chroma.blend('red', 'pink', 'multiply')
chroma.blend.multiply('red', 'pink')
```



# color output

Finally, chroma.js allows you to output colors in various color spaces and formats.

```js
color.hex()     // '#ff0000'
color.name()    // 'red'
color.rgb()     // [255,0,0]
color.hsl()
color.lab()
color.luminance()
color.temperature()  // 6500 (Kelvin)
```

If the output color format is returned as separate channels, you can access them both using numeric and named indexes:

```
color.rgb()[0]      // 255
color.rgb().r       // 255
color.rgb().red     // 255
```

For a complete list of supported output formats, read the [API docs]().


