

# Initializing colors
    
## chroma.color(a, b, c, mode)

Generic color factory. Returns an instance of chroma.Color. mode defaults to "rgb".

The following calls all return the same color (red #ff0000):

    chroma.color("red");
    chroma.color("#ff0000");
    chroma.color("#f00");
    chroma.color("FF0000");
    chroma.color(255, 0, 0);
    chroma.color([255, 0, 0]);
    chroma.color(0, 1, 0.5, 'hsl');
    chroma.color([0, 1, 0.5], 'hsl');
    chroma.color(0, 1, 1, 'hsv');
    chroma.color("rgb(255,0,0)");
    chroma.color("rgb(100%,0%,0%)");
    chroma.color("hsl(0,100%,50%)");   
    chroma.color(53.24, 80.09, 67.20, 'lab')
    chroma.color(53.24, 104.55, 40, 'lch')
    
## chroma.hex() / chroma.css()

Returns a color from a hex code or css color. Alias: **chroma.css()**

    chroma.hex("#ff0000");
    chroma.hex("red");
    chroma.hex("rgb(255, 0, 0)");
    
## chroma.*xyz*()

Creates a chroma.Color instance from a specific color space. Shortcut to *chroma.color(…, mode)*.

    chroma.rgb(255, 0, 0);
    chroma.hsl(0, 1, 0.5);
    chroma.hsv(120, 0.5, 0.5);
    chroma.lab(53.24, 80.09, 67.20);
    chroma.lch(53.24, 104.55, 40);


# Working with colors

However you initialized the color, here's what you can do with it:

## color.darker(*amount*)

Decreases the lightness of the color in *Lch* color space.

    chroma.color('red').darker().hex()  // #BC0000

## color.brigter(*amount*)

    chroma.color('red').brighter().hex()  // #FF603B

## color.saturate(*amount*)

## color.desaturate(*amount*)

## color.*xyz*()

Returns the color components for a specific color space:

    chroma.color('red').hex()  // "#FF0000""
    chroma.color('red').rgb()  // [255, 0, 0]
    chroma.color('red').hsv()  // [0, 1, 1]
    chroma.color('red').hsl()  // [0, 1, 0.5]
    chroma.color('red').lab()  // [53.2407, 80.0924, 67.2031]
    chroma.color('red').lch()  // [53.2407, 104.5517, 39.9990]
    
## color.luminance()

Returns the [relative luminance](http://www.w3.org/TR/WCAG20/#relativeluminancedef) of the color, which is a value between 0 (black) and 1 (white).

    chroma.color('black').luminance() // 0
    chroma.color('white').luminance() // 1
    chroma.color('red').luminance() // 0.2126

## chroma.contrast(a, b)

Returns the [contrast ratio](http://www.w3.org/TR/WCAG20/#contrast-ratiodef) between two given colors. According to the [Web Content Accessibility Guidelines](http://www.w3.org/TR/WCAG20) the contrast between background and small text [should be at least](http://www.w3.org/TR/WCAG20/#visual-audio-contrast-contrast) 4.5 : 1.

    chroma.contrast('white', 'navy')  // 16.00 – ok
    chroma.contrast('white', 'yellow')  // 1.07 – not ok!


# Working with color scales
    
## chroma.scale()

Creates a color scale function from the given set of colors. 

    var scale = chroma.scale(['lightyellow', 'navy']);
    scale(0.5);  // #7F7FB0

Need some advice for good colors? How about using a pre-defined [ColorBrewer](http://colorbrewer2.com) scale:

    chroma.scale('RdYlBu');
    

### scale.out()

By default the color scale functions return instances of chroma.Color.

    var col = scale(0.5);
    col.hex();  // #7F7FB0
    col.rgb();  // [127.5, 127.5, 176]    
    
Using **scale.out()** you can configure the color scale to automatically return colors in the desired format.

    scale = chroma.scale(['lightyellow', 'navy']).out('hex');
    scale(0.5);  // "#7F7FB0"

### scale.mode()

Specify in which color space the colors should be interpolated. Defaults to "rgb". You can use any of the following spaces:

    var scale = chroma.scale(['lightyellow', 'navy']);
    scale.mode('hsv')(0.5);  // #54C08A
    scale.mode('hsl')(0.5);  // #31FF98
    scale.mode('lab')(0.5);  // #967CB2
    scale.mode('lch')(0.5);  // #D26662

  
### scale.domain()

You can specify the input range of your data (defaults to [0..1]).

    var scale = chroma.scale(['lightyellow', 'navy']).domain([0, 400]);
    scale(200);  // #7F7FB0

Instead of just passing the minimum and maximum values you can specify custom "stops". chroma.js would now return a distinct set of four different colors:

    var scale = chroma.scale(['lightyellow', 'navy'])
        .domain([0, 100, 200, 300, 400]);
    scale(98);  // #7F7FB0
    scale(99);  // #7F7FB0
    scale(100);  // #AAAAC0
    scale(101);  // #AAAAC0

If you don't want to pick the stops by hand, you can auto-generate a set of *N* equidistant input classes:

    chroma.scale(['#eee', '#900']).domain([0, 400], 7);

Don't like linear scales? How about logarithmic stops?

    chroma.scale(['#eee', '#900']).domain([1, 1000000], 7, 'log');
    
For more advanced techniques you need the actual dataset 

    chroma.scale(['#eee', '#900']).domain(values, 5, 'quantiles');
    chroma.scale(['#eee', '#900']).domain(values, 5, 'k-means');
    
### scale.range()

If you need to change the color range after initializing the color scale.

    chroma.scale().range(['lightyellow', 'navy']);
