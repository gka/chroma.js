# Chroma.js

Chroma.js is a neat library for all kinds of color conversions.

## Instanciate colors
Instanciate red in multiple ways:
	
	col = chroma.rgb(255,0,0); 
	col = chroma.hex('#ff0000');
	col = chroma.hsv(0,1,1);
	col = chroma.hsl(0,1,.5);

Behind the scenes, the previous shorthand statements would resolve to

	col = new chroma.Color(255,0,0); // defaut to rgb
	col = new chroma.Color('#ff0000'); // or hex, if first param is string
	col = new chroma.Color(0,1,1,'hsv');
	col = new chroma.Color(0,1,.5,'hsl');	
	
## Convert colors
Regardless of how you instanciated the color, you can convert 

	col.rgb // 
	col.hex() // '#ff0000'
 	col.hsv() // [0,1,1]
	col.hsl() // [0,1,.5]
	col.lab() //
	col.cls() // ..

## Interpolating colors

Simple RGB interpolation:

	col2 = chroma.hex('#0000ff'); 
	col.interpolate(.5, col2);

You can define

	col.interpolate(.5, col2, 'hsv');
	col.interpolate(.5, col2, 'hsl');
	col.interpolate(.5, col2, 'lab');
	col.interpolate(.5, col2, 'cls');

