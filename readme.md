# Chroma.js

Chroma.js is a tiny JavaScript library for all kinds of color conversions.

## Instanciate colors

Short API:

	col = chroma.hex("#ff0000");
	col = chroma.rgb(255,128,10);
	col = chroma.hsl(120,1,.5);
	col = chroma.hsv(120,1,1);
	col = chroma.lab(.8,.7,-.4);
	col = chroma.csl(120,1,1);

Long API:

	col = new chroma.Color(255,128,10,'rgb');
	col = new chroma.Color(120,1,.5,'hsv');

	
## Convert colors
Regardless of how you instanciated the color, you can convert 

	col.rgb // [255,0,0]
	col.hex() // '#ff0000'
 	col.hsv() // [0,1,1]
	col.hsl() // [0,1,.5]
	col.lab() // ...
	col.cls() // ..

## Interpolating colors

Short API

	chroma.interpolate("#c00", "#e88", .5, 'hsl')

Long API

	col1 = chroma.hex('#c00');
	col2 = chroma.hex('#e88'); 
	col1.interpolate(.5, col2, 'hsl');
