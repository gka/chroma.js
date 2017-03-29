
# chroma.js

**chroma.js** is a tiny JavaScript library (12kB) for dealing with colors!

[![Build Status](https://travis-ci.org/gka/chroma.js.svg?branch=master)](https://travis-ci.org/gka/chroma.js)

## Quick-start

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

## API

### chroma

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

### chroma.hsl

Alternatively, every color space has its own constructor function under the `chroma` namespace. For a list of all supported color spaces, check the [appendix](#supported-color-spaces-and-output-formats).

```js
chroma.hsl(330, 1, 0.6)
```

### chroma.hsv

### chroma.lab

### chroma.lch

**L**: Lightness, **c**: chroma (0-1), **h**: hue (0-1).

```js
chroma.lch(80, 40, 130);
chroma(80, 40, 130, 'lch');
```

### chroma.hcl

You can use **hcl** instead of Lch, too. It is all the same, except that lightness and hue channels are switched to be more consistent with HSL.

```js
chroma.hcl(130, 40, 80);
chroma(130, 40, 80, 'hcl');
```

### chroma.cmyk

cyan, magenta, yellow, black, each between 0 and 1.

```js
chroma.cmyk(0.2, 0.8, 0, 0);
chroma(0.2, 0.8, 0, 0, 'cmyk');
```

### chroma.gl

**GL** is a variant of RGB(A), with the only difference that the components are normalized to the range of `0..1`.

```js
chroma.gl(0.6, 0, 0.8);
chroma.gl(0.6, 0, 0.8, 0.5);
chroma(0.6, 0, 0.8, 'gl');
```

### chroma.temperature

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

### chroma.mix

Simplest way. Mix two colors can be achieved in multiple ways. Change the mix ratio by passing a value between 0 and 1 as third parameter. In the following example, red will be mixed with blue. 

```js
chroma.mix('red', 'blue');
chroma.mix('red', 'blue', 0.25);
```

The color mixing produces different results based on what color space the colors are interpolated in. The default color space is `rgb` but in the following example we interpolate in `Lab` instead.  

```js
chroma.mix('red', 'blue', 0.5, 'rgb');
chroma.mix('red', 'blue', 0.5, 'hsl');
chroma.mix('red', 'blue', 0.5, 'lab');
chroma.mix('red', 'blue', 0.5, 'lch');
```

### chroma.average

Similar to `chroma.mix(color1, color2, 'rgb')`, but works with more than two colors. Simple averaging of R,G,B components and the alpha channel.

```js
chroma.average(['white', 'yellow', 'red', 'teal']);
chroma.average(['red', 'rgba(0,0,0,0.5)']).alpha();
```

### chroma.blend

Blends two colors using RGB channel-wise blend functions. Valid blend modes are `multiply`, `darken`, `lighten`, `screen`, `overlay`, `burn`, and `dogde`.

```js
chroma.blend('4CBBFC', 'EEEE22', 'multiply');
chroma.blend('4CBBFC', 'EEEE22', 'darken');
chroma.blend('4CBBFC', 'EEEE22', 'lighten');
```

### chroma.random

Returns a random color.

```js
chroma.random();
chroma.random();
chroma.random();
```

### chroma.contrast

Computes the WCAG contrast ratio between two colors. A minimum contrast of 4.5:1 [is recommended](http://www.w3.org/TR/WCAG20-TECHS/G18.html) to ensure that text is still readable against a background color.

```js
// contrast smaller than 4.5 = too low
chroma.contrast('pink', 'hotpink');
// contrast greater than 4.5 = high enough
chroma.contrast('pink', 'purple');
```

### chroma.brewer

chroma.brewer is an map of ColorBrewer scales that are included in chroma.js for convenience. chroma.scale uses the colors to construct.

```js
chroma.brewer.OrRd
```

### chroma.limits

`chroma.limits(data, mode, n)` is a little helper function that computes class breaks for you, based on data. It supports the modes _equidistant_ (e), _quantile_ (q), _logarithmic_ (l), and _k-means_ (k). Let's take a few numbers as sample data. 

```js
var data = [2.0,3.5,3.6,3.8,3.8,4.1,4.3,4.4,
            4.6,4.9,5.2,5.3,5.4,5.7,5.8,5.9,
            6.2,6.5,6.8,7.2,8];
```

**equidistant** breaks are computed by dividing the total range of the data into _n_ groups of equal size.

```js
chroma.limits(data, 'e', 4);
```

In the **quantile** mode, the input domain is divided by quantile ranges. 

```js
chroma.limits(data, 'q', 4);
```

**logarithmic** breaks are equidistant breaks but on a logarithmic scale. 

```js
chroma.limits(data, 'l', 4);
```

**k-means** break is using the 1-dimensional [k-means clustering](https://en.wikipedia.org/wiki/K-means_clustering) algorithm to find (roughly) _n_ groups of "similar" values. Note that this k-means implementation does not guarantee to find exactly _n_ groups.

```js
chroma.limits(data, 'k', 4);
```


## color

### color.alpha

Get and set the color opacity using ``color.alpha``.

```js
chroma('red').alpha(0.5);
chroma('rgba(255,0,0,0.35)').alpha();
```

### color.darken / brighten

Once loaded, chroma.js can change colors. One way we already saw above, you can change the lightness.

```js
chroma('hotpink').darken();
chroma('hotpink').darken(2);
chroma('hotpink').brighten();
```


### color.saturate

You can also **saturate** colors. chroma.js will use the `Lch` color space to saturate/desaturate the colors.

```js
chroma('slategray').saturate(); 
chroma('slategray').saturate(2); 
```

### color.desaturate

```js
chroma('hotpink').desaturate();
chroma('hotpink').desaturate(2);
chroma('hotpink').desaturate(3);
```


### color.set

Set a channel of a color space.

```js
// change hue to 0 deg (=red)
chroma('skyblue').set('hsl.h', 0);
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

### color.get

```js
chroma('orangered').get('lab.l');
chroma('orangered').get('hsl.l');
chroma('orangered').get('rgb.g');
```

### color.luminance 

Returns the relative brightness of any point in a colorspace, normalized to `0` for darkest black and `1` for lightest white according to the [WCAG definition](http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef).

```js
chroma('white').luminance();
chroma('aquamarine').luminance();
chroma('hotpink').luminance();
chroma('darkslateblue').luminance();
chroma('black').luminance();
```

chroma.js also allows you to **adjust the luminance** of a color. The source color will be interpolated with black or white until the correct luminance is found.

```js
// set lumincance to 50% for all colors
chroma('white').luminance(0.5);
chroma('aquamarine').luminance(0.5);
chroma('hotpink').luminance(0.5);
chroma('darkslateblue').luminance(0.5);
```

By default, this interpolation is done in RGB, but you can interpolate in different color spaces by passing them as second argument:

```js
chroma('aquamarine').luminance(0.5); // rgb
chroma('aquamarine').luminance(0.5, 'lab');
chroma('aquamarine').luminance(0.5, 'hsl');
```

### color.hex

Finally, chroma.js allows you to output colors in various color spaces and formats.

Most often you will want to output the color as hexadecimal string.

```js
chroma('orange').hex()
```

### color.name

Returns the named color. Falls back to hexadecimal RGB string, if the color isn't present.

```js
chroma('#ffa500').name();
chroma('#ffa505').name();
```

### color.css

Returns a `RGB()` or `HSL()` string representation that can be used as CSS-color definition.

```js
chroma('teal').css();
chroma('teal').alpha(0.5).css();
chroma('teal').css('hsl');
```

### color.rgb

Returns an array with the `red`, `green`, and `blue` component, each as number within the range `0..255`.

```js
chroma('orange').rgb()
```

### color.hsl

Returns an array with the `hue`, `saturation`, and `lightness` component. Hue is the color angle in degree (`0..360`), saturation and lightness are within `0..1`. Note that for hue-less colors (black, white, and grays), the hue component will be NaN.

```js
chroma('orange').hsl();
chroma('white').hsl();
```

### color.hsv

Returns an array with the `hue`, `saturation`, and `value` components. Hue is the color angle in degree (`0..360`), saturation and value are within `0..1`. Note that for hue-less colors (black, white, and grays), the hue component will be NaN.

```js
chroma('orange').hsv();
chroma('white').hsv();
```

### color.hsi

Returns an array with the `hue`, `saturation`, and `intensity` components, each as number between 0 and 255. Note that for hue-less colors (black, white, and grays), the hue component will be NaN.

```js
chroma('orange').hsi();
chroma('white').hsi();
```

### color.lab

Returns an array with the **L**, **a**, and **b** components.

```js
chroma('orange').lab()
```


### color.lch

Returns an array with the **Lightness**, **chroma**, and **hue** components.

```js
chroma('skyblue').lch()
```

### color.hcl

Essentially an alias of [lch](#color-lch), but with the components in reverse order.

```js
chroma('skyblue').hcl()
```


### color.temperature

Estimate the temperature in Kelvin of any given color, though this makes the only sense for colors from the [temperature gradient](#chroma-temperature) above.

```js
chroma('#ff3300').temperature();
chroma('#ff8a13').temperature();
chroma('#ffe3cd').temperature();
chroma('#cbdbff').temperature();
chroma('#b3ccff').temperature();
```


### color.gl

```js
chroma('33cc00').gl();
```


For a complete list of supported output formats, read the [API docs]().

## color scales

### chroma.scale

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

### scale.domain

You can change the input domain to match your specific use case.

```js
// default domain is [0,1]
chroma.scale(['yellow', '008ae5']);
// set domain to [0,100]
chroma.scale(['yellow', '008ae5']).domain([0,100]);
```

You can use the domain to set the exact positions of each color.

```js
// default domain is [0,1]
chroma.scale(['yellow', 'lightgreen', '008ae5'])
    .domain([0,0.25,1]);
```


### scale.mode

As with `chroma.mix`, the result of the color interpolation will depend on the color mode in which the channels are interpolated. The default mode is `RGB`:

```js
chroma.scale(['yellow', '008ae5']);
```

This is often fine, but sometimes, two-color `RGB` gradients goes through kind of grayish colors, and `Lab` interpolation produces better results:

```js
chroma.scale(['yellow', 'navy']);
chroma.scale(['yellow', 'navy']).mode('lab');
```

Other useful interpolation modes could be `HSL` or `Lch`, though both tend to produce too saturated / glowing gradients.

```js
chroma.scale(['yellow', 'navy']).mode('lab');
chroma.scale(['yellow', 'navy']).mode('hsl');
chroma.scale(['yellow', 'navy']).mode('lch');
```

### chroma.brewer

chroma.js includes the definitions from [ColorBrewer2.org](http://colorbrewer2.org/). Read more about these colors [in the corresponding paper](http://www.albany.edu/faculty/fboscoe/papers/harrower2003.pdf) by Mark Harrower and Cynthia A. Brewer.

```js
chroma.scale('YlGnBu');
chroma.scale('Spectral');
```

To reverse the colors you could simply reverse the domain:

```js
chroma.scale('Spectral').domain([1,0]);
```

You can access the colors directly using `chroma.brewer`.

```js
chroma.brewer.OrRd
```


### scale.correctLightness
Sometimes

```js
chroma.scale(['yellow', '008ae5']).mode('lch');

chroma.scale(['yellow', '008ae5'])
	.mode('lch')
	.correctLightness();
```

### chroma.bezier

`chroma.bezier` returns a function that performs a bezier interpolate. The input range of the function is `[0..1]`. Bezier interpolation is always done in `Lab` space.

```js
// linear interpolation
chroma.scale(['yellow', 'red', 'black']);
// bezier interpolation
chroma.bezier(['yellow', 'red', 'black']);
// convert bezier interpolator into chroma.scale
chroma.bezier(['yellow', 'red', 'black'])
    .scale().colors(5);
```

Bezier interpolation

### chroma.cubehelix

Dave Green's [cubehelix color scheme](http://www.mrao.cam.ac.uk/~dag/CUBEHELIX/)!!

Parameters (description copied from Dave Green):

* **start** color for [hue rotation](http://en.wikipedia.org/wiki/Hue#/media/File:HueScale.svg), default=`300`
* **rotations**: number of rotations (e.g. 1=`360°`, 1.5=`540°``), default=-1.5
* **hue**: controls how saturated the colour of all hues are. either single value or range, default=1
* **gamma factor**: can be used to emphasise low or high intensity values, default=1
* **lightness** range: default: [0,1]  (black -> white)


```js
// use the default helix...
chroma.cubehelix();
// or customize it
chroma.cubehelix()
    .start(200)
    .rotations(-0.5)
    .gamma(0.8)
    .lightness([0.3, 0.8]);
```

You can call `cubehelix.scale()` to use the cube-helix through the `chroma.scale()` interface.

```js
chroma.cubehelix()
    .start(200)
    .rotations(-0.35)
    .gamma(0.7)
    .lightness([0.3, 0.8])
  .scale() // convert to chroma.scale
    .correctLightness()
    .colors(5);
```

### scale.padding

Reduces the color range by cutting of a fraction of the gradient on both sides. If you pass a single number, the same padding will be applied to both ends.

```js
chroma.scale('RdYlBu');
chroma.scale('RdYlBu').padding(0.15);
```

Alternatively you can specify the padding for each sides individually by passing an array of two numbers.

```js
chroma.scale('OrRd');
chroma.scale('OrRd').padding([0.2, 0]);
```


### scale.colors

You can call `scale.colors(n)` to quickly grab `n` equi-distant colors from a color scale. If called with no arguments, `scale.colors` returns the original array of colors used to create the scale.

```js
chroma.scale('OrRd').colors(5);
chroma.scale(['white', 'black']).colors(12);
```

### scale.classes

If you want the scale function to return a distinct set of colors instead of a continuous gradient, you can set custom class breaks:

```js
chroma.scale('OrRd').classes(5);
chroma.scale('OrRd').classes(8);
```

You can also define custom class breaks by passing them as array: 

```js
chroma.scale('OrRd').classes([0,0.3,0.55,0.85,1]);
```


Note that this works with any color scale:

```js
chroma.cubehelix()
    .rotations(-0.35)
    .lightness([0.1, 0.8])
    .scale()
    .classes(breaks)
```

