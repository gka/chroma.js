
# chroma.js

**chroma.js** is a tiny JavaScript library (12kB) for dealing with colors!

[![Build Status](https://travis-ci.org/gka/chroma.js.svg?branch=master)](https://travis-ci.org/gka/chroma.js)

Here are a couple of things chroma.js can do for you:

* read colors from a wide range of formats
* analyze and manipulate colors
* convert colors into wide range of formats
* linear and bezier interpolation in different color spaces

Here's an example for a simple read / manipulate / output chain:

```js
chroma('pink').darken().saturate(2).hex()
```

Aside from that, chroma.js can also help you **generate nice colors** using various methods, for instance to be used in color palette for maps or data visualizations.

```js
chroma.scale(['white','green','blue']).colors(5)
```

chroma.js has a lot more to offer, but that's the basic gist of it.

## Reading colors

The first step is to get your color into chroma.js. That's what the generic constructor ``chroma()`` does. The function is trying to guess the color format for you. For instances, it will recognized any named color from the W3CX11 specification:   

```js
chroma('hotpink') 
```

If there's no matching named color chroma.js checks for a **hexadecimal string**. It ignores case, the `#` sign is optional, and the shorter three letter format is recognized as well. So any of these are valid hexadecimal representations: `#ff3399`, `FF3399`, `#f39`, etc.

```js
chroma('#ff3399'); 
chroma('F39');
```

In addition to hex strings, **hexadecimal numbers** (in fact, just any number between `0` and `16777215`), will be recognized, too.

```js
chroma(0xff3399) 
```

If you pass the RGB channels individually, too. Each parameter must be within `0..255`. You can pass the numbers as individual arguments or as array.

```js
chroma(0xff, 0x33, 0x99);
chroma(255, 51, 153);
chroma([255, 51, 153]);
```

You can construct colors from different color spaces by passing the name of color space as the last argument. Here we define the same color in HSL by passing the h*ue angle (0-360) and percentages for *s*aturation and *l*ightness:

```js
chroma(330, 1, 0.6, 'hsl')
```

Alternatively, every color space has it's own constructor function under the `chroma` namespace. For a list of all supported color spaces, check the [appendix](#supported-color-spaces-and-output-formats).

```js
chroma.hsl(330, 1, 0.6)
```

### Alpha channel

You can always set the `opacity` using ``.alpha()``, but before the color mode.

```js
chroma('red').alpha(0.5);
chroma('rgba(255,0,0,0.5)');
```


## Analyze and manipulate colors

### Change brightness

Once loaded, chroma.js can change colors. One way we already saw above, you can change the lightness.

```js
chroma('hotpink').darken();
chroma('hotpink').darken(2);
chroma('hotpink').brighten();
```


### Change saturation

You can also **saturate** colors. chroma.js will use the `Lch` color space to saturate/desaturate the colors.

```js
chroma('slategray').saturate(); 
chroma('slategray').saturate(2); 
```

You can **desaturate** colors, too. 

```js
chroma('hotpink').desaturate();
chroma('hotpink').desaturate(3);
// destaturate is the same as negative saturation
chroma('hotpink').saturate(-3);
```


### Set/get generic channels

Set a channel of a color space.

```js
// change hue to 0 deg
chroma('hotpink').set('hsl.h', 0);
// set chromacity to 30
chroma('hotpink').set('lch.c', 30);
```


Relative changes work, too:

```js
// half Lab lightness
chroma('orangered').set('lab.l', '*0.5');
// double Lch saturation
chroma('darkseagreen').set('lch.c', '*2');
```

### Relative luminance

Returns the relative brightness of any point in a colorspace, normalized to `0` for darkest black and `1` for lightest white according to the [WCAG definition](http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef).

```js
chroma('white').luminance();
chroma('aquamarine').luminance();
chroma('hotpink').luminance();
chroma('darkslateblue').luminance();
chroma('black').luminance();
```

chroma.js also allows you to **set the luminance** of a color. The source color will be interpolated with black or white until the correct luminance is found.

```js
// set lumincance to 50% for all colors
chroma('white').luminance(0.5);
chroma('aquamarine').luminance(0.5);
chroma('hotpink').luminance(0.5);
chroma('darkslateblue').luminance(0.5);
```

### Contrast ratio

Computes the WCAG contrast ratio between two colors. A minimum contrast of 4.5:1 [is recommended](http://www.w3.org/TR/WCAG20-TECHS/G18.html) to ensure that text is still readable against a background color.

```js
// contrast < 4.5, too low
chroma.contrast('pink', 'hotpink');
// contrast > 4.5 high enough
chroma.contrast('pink', 'purple');
```

### Color temperature

light 2000K, bright sunlight 6000K. Based on [Neil Bartlett's implementation](https://github.com/neilbartlett/color-temperature). 

```js
chroma.temperature(2000); // candle light
chroma.temperature(3500); // sunset
chroma.temperature(6000); // bright sunlight
```

The effective temperature range goes from `0` to about `20000` Kelvin:

```js
f = function(i) {
    return chroma.temperature(i * 20000)
}
```


You can also estimate the temperature of any given color, though this makes the only sense for colors from the temperature gradient above.

```js
chroma('#ff3300').temperature();
chroma('#ff8a13').temperature();
chroma('#ffe3cd').temperature();
chroma('#cbdbff').temperature();
chroma('#b3ccff').temperature();
```



## Mixing colors

Simplest way. Mix two colors can be achieved in multiple ways. Change the mix ratio by passing a value between 0 and 1 as third parameter. In the following example, red will be mixed with blue. 

```js
chroma.mix('red', 'blue').hex();
chroma.mix('red', 'blue', 0.25).hex();
```

The color mixing produces different results based on what color space the colors are interpolated in. The default color space is `rgb` but in the following example we interpolate in `Lab` instead.  

```js
chroma.mix('red', 'blue', 0.5, 'rgb');
chroma.mix('red', 'blue', 0.5, 'hsl');
chroma.mix('red', 'blue', 0.5, 'lab');
chroma.mix('red', 'blue', 0.5, 'lch');
```

### Blending colors

```js
chroma.blend('4CBBFC', 'EEEE22', 'multiply');
chroma.blend('4CBBFC', 'EEEE22', 'darken');
chroma.blend('4CBBFC', 'EEEE22', 'lighten');
chroma.blend('4CBBFC', 'EEEE22', 'screen');
chroma.blend('4CBBFC', 'EEEE22', 'overlay');
chroma.blend('4CBBFC', 'EEEE22', 'burn');
chroma.blend('4CBBFC', 'EEEE22', 'dodge');
```

## Color scales

A color scale, created with `chroma.scale`, is a function that maps numeric values to a color palette. The default scale has the domain `0..1` and goes from white to black.

```js
f = chroma.scale();
f(0.25);
f(0.5);
f(0.75);
```

You can pass an array of colors to `chroma.scale`. Any color that can be read by `chroma()` will work here, too. If you pass more than two colors, they will be evenly distributed along the gradient.


```js
chroma.scale(['yellow', '008ae5']);
chroma.scale(['yellow', 'red', 'black']);
```

### Custom domain

You can change the input domain to match your specific use case.

```js
// default domain is [0,1]
chroma.scale(['yellow', '008ae5'])(0.5);
// set domain to [0,100]
chroma.scale(['yellow', '008ae5'])
    .domain([0,100])(50);
```

You can change the input domain to match your specific use case.

```js
// default domain is [0,1]
chroma.scale(['yellow', 'lightgreen', '008ae5'])
    .domain([0,0.25,1]);
```



### Specifying interplation space

As with chroma.mix, the result of the interpolation will depend on the color mode.

```js
chroma.scale(['yellow', '008ae5']);
chroma.scale(['yellow', '008ae5']).mode('lab');
chroma.scale(['yellow', '008ae5']).mode('lch');
```

### Lightness correction
Sometimes

```js
chroma.scale(['yellow', '008ae5']).mode('lch');

chroma.scale(['yellow', '008ae5'])
	.mode('lch')
	.correctLightness(1);
```

### Bezier interpolation

`chroma.bezier` returns a function that performs a bezier interpolate. The input range of the function is `[0..1]`. Bezier interpolation is always done in `Lab` space.

```js
// linear interpolation
chroma.scale(['white', 'yellow', 'red', 'black']);
// bezier interpolation
chroma.bezier(['white', 'yellow', 'red', 'black']);
// convert bezier interpolator into chroma.scale
chroma.bezier(['white', 'yellow', 'red', 'black'])
    .scale().colors(6);
```

Bezier interpolation

### Cube-helix

Dave Green's [cubehelix color scheme](http://www.mrao.cam.ac.uk/~dag/CUBEHELIX/)!!

Parameters (description copied from Dave Green):

* **start** color for [hue rotation](http://en.wikipedia.org/wiki/Hue#/media/File:HueScale.svg), default=`300`
* **rotation**: number of rotations (e.g. 1=`360°`, 1.5=`540°``), default=-1.5
* **hue**: controls how saturated the colour of all hues are. either single value or range, default=1
* **gamma factor**: can be used to emphasise low or high intensity values, default=1
* **lightness** range: default: [0,1]  (black -> white)


```js
chroma.cubehelix().start(0);
chroma.cubehelix().start(50);
chroma.cubehelix().rotations(0.5);
// convert into chroma.scale
chroma.cubehelix().scale().colors(7);

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
chroma('pink').temperature() 
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

### RGB

**r**ed, **g**reen, **b**lue, each between 0 and 255.

```js
chroma(200, 0, 30);
chroma.rgb(0.2, 0.8, 0, 0);
chroma(0.2, 0.8, 0, 0, 'rgb');
```
```js
chroma('lime').rgb()
```

Another way to input and output RGB colors is as *hexadecimal* strings:

```js
chroma('#EE5500');
chroma.hex('#EE5500');
```
```js
chroma('hotpink').hex()
```

Another way to input and output RGB colors is as *hexadecimal* strings:

```js
chroma(0xEE5500);
chroma.num(0xEE5500);
```
```js
chroma('hotpink').num()
```

### CMYK

**c**yan, **m**agenta, **y**ellow, **b**lack, each between 0 and 1.

```js
chroma.cmyk(0.2, 0.8, 0, 0);
chroma(0.2, 0.8, 0, 0, 'cmyk');
```
```js
chroma('lime').cmyk()
```

### HSL

**h**ue (0-360), **s**aturation (0-1), **l**ightness (0-1).

```js
chroma.hsl(60, 0.8, 0.5);
chroma(60, 0.8, 0.5, 'hsl');
```
```js
chroma('tomato').hsl()
```

### HSV

**h**ue (0-360), **s**aturation (0-1), **v**alue (0-1).

```js
chroma.hsv(60, 0.8, 0.8);
chroma(60, 0.8, 0.8, 'hsv');
```
```js
chroma('tomato').hsv()
```

### HSI

**h**ue (0-360), **s**aturation (0-1), **i**ntensity (0-1).

```js
chroma.hsi(60, 0.8, 0.8);
chroma(60, 0.8, 0.8, 'hsi');
```
```js
chroma('tomato').hsi()
```

### Lab
**L**ightness (0-100), **a** (-100 - 100), **b** (-100 - 100).

```js
chroma.lab(80, 40, 130);
chroma(80, 40, 130, 'lab');
```

```js
chroma('cyan').lab()
```

### Lch

**L**ightness, **c**hroma (0-1), **h**ue (0-1).

```js
chroma.lch(80, 40, 130);
chroma(80, 40, 130, 'lch');
```

```js
chroma('tomato').lch()
```

### HCL

**HCL**: Btw, if you prefer, you can use **hcl** instead of Lch, too. It is all the same, except that lightness and hue channels are switched to be more consistent with HSL.

```js
chroma.hcl(130, 40, 80);
chroma(130, 40, 80, 'hcl');
```

```js
chroma('tomato').hcl()
```

### CSS

**CSS** If you pass a string that does not look like a hexadecimal color, chroma.js will try to parse it as CSS-color, either as `rgb()`, `rgba()`, `hsl()`, or `hsla()`.

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

### GL
**GL** is a variant of RGB(A), with the only difference that the components are normalized to the range of `0..1`.

```js
chroma.gl(0.2, 0.8, 0);
chroma(0.2, 0.8, 0, 'gl');
```
```js
chroma('33cc00').gl();
```
sdsd
