
# chroma.js

## Quick start

**chroma.js** is a JavaScript library for dealing with colors!

chroma.js can **read** colors from various formats, **manipulate** them in different ways and finally **output** them in the format you want.

Here's an example for a simple read / manipulate / output chain:

```js
chroma('pink').darken(20).hex()
```


Aside from that, chroma.js can also help you **generate nice colors** using various methods, for instance to be used in color palette for maps or data visualizations.

```js
chroma.scale(['white','green','blue']).colors(5)
```

chroma.js has a lot more to offer, but that's the basic gist of it.

## Reading colors from various formats

The first step is to get your color into chroma.js. That's what the generic constructor ``chroma()`` does. The function is trying to guess the color format for you. For instances, it will recognized any named color from the W3CX11 specification:   

```js
chroma('hotpink') 
```

If there's no matching named color chroma.js checks for a **hexadecimal string**. It ignores case, the `#` sign is optional, and the shorter three letter format is recognized, too. So any of these are valid hexadecimal representations: `#ff3399`, `FF3399`, `#f39`, etc.

```js
chroma('#ff3399') 
```

In addition to hex strings, **hexadecimal numbers** (in fact, just any number between 0 and 0xffffff), will be recognized, too.

```js
chroma(0xff3399) 
```

If you pass three numbers chroma.js will assume they are red, green and blue values between `0` and `255`.

```js
chroma(255,51,153)
```

You can construct colors from different color spaces by passing the name of color space as the last argument. Here we define the same color in HSL by passing the **h**ue angle (0-360) and percentages for **s**aturation and **l**ightness:

```js
chroma(330, 1, 0.6, 'hsl')
```

Alternatively, every color space has it's own constructor function under the `chroma` namespace:

```js
chroma.hsl(330, 1, 0.6)
```



If you pass a string that does not look like a hexadecimal color, chroma.js will try to parse it as CSS-color, either as `rgb()`, `rgba()`, `hsl()`, or `hsla()`.

```js
chroma('rgb(255,51,153)')
```
```js
chroma('hsla(330,100%,60%,0.5)')
```
You can access the alpha channel using `alpha()`.
```js
chroma('hsla(330,100%,60%,0.5)').alpha()
```

### Importing from more color spaces 

Additional to the generic color consuctor chroma.js provides . chroma.js can read colors in various different color spaces.

```js
chroma.hsl(60, 1, 0.5) 
```
```js
chroma.hsv(60,1,0.5)
```
CMYK
```js
chroma.cmyk(1, 0, 0.5, 0.5)
```
```js
chroma.lab(0.5, 30, 60) // lightness,A*,B*
```
```js
chroma.hcl(60, 1, 0.6)  // hue,chroma,lightness
```

chroma.js generally accepts a variety to input APIs, mainly because I couldn't decide which one I like best. Use whatever you want.

```js
chroma.hsl(60, 1, 0.5);    // one argument per channel
chroma.hsl([60, 1, 0.5]);  // all channels as single array
chroma(60, 1, 0.5, 'hsl'); // passing mode as last parameter
```

## manipulating colors

Once loaded, chroma.js can change colors. One way we already saw above, you can change the lightness.

```js
chroma('hotpink')color.darken();      // make color darker
chroma('hotpink').darken(30);    // make color even darker
chroma('hotpink').brighten();    // make color brighter
```

You can also **saturate** colors. The default  is

```js
chroma('slategray').saturate(); 
chroma('slategray').saturate(1.2); 
```
```js
chroma('hotpink').desaturate();
chroma('hotpink').desaturate(1.2);
```

Or you can mix a color with another color:

```js
chroma('blue').mix('red').hex() 
```

If you want to ensure a color has a certain

```js
chroma('hotpink').luminance(0.2)
```



## Mixing two colors

Mix two colors can be achieved in multiple ways.

```js
chroma.mix('red', 'blue').hex()
```

Change the mix ratio by passing a value between 0 and 1 as third parameter. In the following example, red will be mixed with blue. 

```js
chroma.mix('red', 'blue', 0.25).hex()
```

The color mixing produces different results based on what color space the colors are interpolated in. The default color space is `rgb` but in the following example we interpolate in `Lab` instead.  

```js
chroma.mix('red', 'blue', 0.25, 'lab')
```

## darken/brighten colors

```js
chroma('red').darken().hex() //
chroma('red').brighten().hex() //
```

## blending colors

```js
chroma.blend('red', 'pink', 'multiply')
```

```js
chroma.blend.multiply('red', 'pink')
```


## color output

Finally, chroma.js allows you to output colors in various color spaces and formats. Most often you will want to output the color as hexadecimal string.

```js
chroma('orange').hex()
```

**`name`** returns the named color or the hexadecimal string, if the color isn't present.

```js
chroma('#ffa500').name() 
```

**`rgb`** returns an array with the **r**ed, **b**lue, and **g**reen component, each as number between 0 and 255.

```js
chroma('orange').rgb()
```

**`hsl`** returns an array with the **h**ue, **s**aturation, and **l**ightness component, each as number between 0 and 255. Note that for hue-less colors (black, white, and grays), the hue component will be NaN.

```js
chroma('orange').hsl()
```
```js
chroma('white').hsl()
```

**`hsv`** returns an array with the **h**ue, **s**aturation, and **v**alue component, each as number between 0 and 255. Note that for hue-less colors (black, white, and grays), the hue component will be NaN.

```js
chroma('orange').hsv()
```
**`lab`** returns an array with the **L**, **a**, and **b** component, each as number between 0 and 255.

```js
chroma('orange').lab()
```

**luminance** 

```js
chroma('orange').luminance()
```
**temperature** 

```js
chroma('orange').temperature() 
```

If the output color format is returned as separate channels, you can access them both using numeric and named indexes:

```
color.rgb()[0]      // 255
color.rgb().r       // 255
color.rgb().red     // 255
```

For a complete list of supported output formats, read the [API docs]().

## Supported color spaces and output formats

What follows is a complete list of all supported color spaces and formats.

**RGB**: **r**ed, **g**reen, **b**lue, each between 0 and 255.

```js
chroma(200, 0, 30);
chroma.rgb(0.2, 0.8, 0, 0);
chroma(0.2, 0.8, 0, 0, 'rgb');
```
```js
chroma('lime').rgb()
```

**RGB (hex)** Another way to input and output RGB colors is as *hexadecimal* strings:

```js
chroma('#EE5500');
chroma.hex('#EE5500');
```
```js
chroma('hotpink').hex()
```

**RGB (num)** Another way to input and output RGB colors is as *hexadecimal* strings:

```js
chroma(0xEE5500);
chroma.num(0xEE5500);
```
```js
chroma('hotpink').num()
```

**CMYK**: **c**yan, **m**agenta, **y**ellow, **b**lack, each between 0 and 1.

```js
chroma.cmyk(0.2, 0.8, 0, 0);
chroma(0.2, 0.8, 0, 0, 'cmyk');
```
```js
chroma('lime').cmyk()
```

**HSL**: **h**ue (0-360), **s**aturation (0-1), **l**ightness (0-1).

```js
chroma.hsl(60, 0.8, 0.5);
chroma(60, 0.8, 0.5, 'hsl');
```
```js
chroma('tomato').hsl()
```

**HSV**: **h**ue (0-360), **s**aturation (0-1), **v**alue (0-1).

```js
chroma.hsv(60, 0.8, 0.8);
chroma(60, 0.8, 0.8, 'hsv');
```
```js
chroma('tomato').hsv()
```

**HSI**: **h**ue (0-360), **s**aturation (0-1), **i**ntensity (0-1).

```js
chroma.hsi(60, 0.8, 0.8);
chroma(60, 0.8, 0.8, 'hsi');
```
```js
chroma('tomato').hsi()
```

**Lab**: **L**ightness (0-100), **a** (-100 - 100), **b** (-100 - 100).

```js
chroma.lab(80, 40, 130);
chroma(80, 40, 130, 'lab');
```

```js
chroma('cyan').lab()
```

**Lch**: **L**ightness, **c**hroma (0-1), **h**ue (0-1).

```js
chroma.lch(80, 40, 130);
chroma(80, 40, 130, 'lch');
```

```js
chroma('tomato').lch()
```

**HCL**: Btw, if you prefer, you can use **hcl** instead of Lch, too. It is all the same, except that lightness and hue channels are switched to be more consistent with HSL.

```js
chroma.hcl(130, 40, 80);
chroma(130, 40, 80, 'hcl');
```

```js
chroma('tomato').hcl()
```

**CSS**

**GL** is a variant of RGB, with the only difference that the r,g,b components are normalized to the range of 0-1.

```js
chroma.gl(0.2, 0.8, 0);
chroma(0.2, 0.8, 0, 'gl');
```
```js
chroma('33cc00').gl();
```
sdsd
