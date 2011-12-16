# Chroma.js

Chroma.js is a tiny JavaScript library for all kinds of color conversions.

## Working with colors

### Creating instances

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

	
### Conversion into different color spaces
Regardless of how you instanciated the color, you can convert 

	col.rgb // [255,0,0]
	col.hex() // '#ff0000'
 	col.hsv() // [0,1,1]
	col.hsl() // [0,1,.5]
	col.lab() // ...
	col.cls() // ..

### Interpolation between colors

Short API

	chroma.interpolate("#c00", "#e88", .5, 'hsl')

Long API

	col1 = chroma.hex('#c00');
	col2 = chroma.hex('#e88'); 
	col1.interpolate(.5, col2, 'hsl');

## Color scales

Color scales can be used to map a set of data values to colors. 

### Simple mode

In the simplest case, you would just pass two *colors*:

	scale = new chroma.ColorScale(
		colors: ['#EFEE69', '#21313E']
	})
	// all colors between 0 and 1
	scale.getColor(0.23)

You can determine the color space, in which the colors should be interpolated using the *mode* option. The following example would interpolate in **C**hroma **S**aturation **L**ightness space:

	scale = new chroma.ColorScale(
		colors: ['#EFEE69', '#21313E'],
		mode: 'csl'
	})


### Data specific color scales

But since usually your data is not in the range of [0..1] you want to tell the color scale a bit about your data. In the next example, we pass the minimum and maximum value through the *limits* parameter:

	scale = new chroma.ColorScale(
		colors: ['#EFEE69', '#21313E'],
		limits: [0, 10000]
	})
	// now you can get colors in your data range
	scale.getColor(2040)
	
You can use the *limits* parameter to convert the continuous scale into a scale with disctinct classes. In the next example you see a color scale with five equal interval casses:

	scale = new chroma.ColorScale(
		colors: ['#EFEE69', '#21313E'],
		limits: [0, 2000, 4000, 6000, 8000, 10000]
	})
	
Chroma.js comes with a handy utility function that helps you to fill in the *limits* array. For instance, the following would create the same color scale as in the last example:

	data = [1194, 0, 9617, 10000, 4273, ...] 
	scale = new chroma.ColorScale(
		colors: ['#EFEE69', '#21313E'],
		limits: chroma.limits(data, 'equal', 5)
	})

The **chroma.limits()** function currently supports four types of scales. The descriptions written by [Gabriel Flor](http://gabrielflor.it/)

* *equal*: In the **equal intervals** classification system, the entire range of values is divided equally into the desired number of intervals. 
* *quantiles*: In the **quantiles** system, each class is of equal size - each class has the same number of values.
* *k-means*: The **k-means clustering** system creates classes of values such that the sum of the squared distance from each value to the center of its respective class is minimized.
* *continuous*: Equivalent to choosing equal intervals and increasing the number of classes to infinity. Would just return [min, max]

### Complex color scales

The following example creates the "hot" scale which goes from black to red to yellow to white (taken from [Flare Visualization Toolkit](https://github.com/prefuse/Flare/blob/master/flare/src/flare/util/palette/ColorPalette.as#L117)).

	hot = new chroma.ColorScale({
		colors: ['#000000','#ff0000','#ffff00','#ffffff']
		positions: [0,.25,.75,1]
		mode: 'rgb'
	})

