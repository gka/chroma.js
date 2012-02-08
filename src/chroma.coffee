###*
    chroma.js - a neat JS lib for color conversions
    Copyright (C) 2011  Gregor Aisch

	The JavaScript code in this page is free software: you can
    redistribute it and/or modify it under the terms of the GNU
    General Public License (GNU GPL) as published by the Free Software
    Foundation, either version 3 of the License, or (at your option)
    any later version.  The code is distributed WITHOUT ANY WARRANTY;
    without even the implied warranty of MERCHANTABILITY or FITNESS
    FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.

    As additional permission under GNU GPL version 3 section 7, you
    may distribute non-source (e.g., minimized or compacted) forms of
    that code without the copy of the GNU GPL normally required by
    section 4, provided you include this license notice and a URL
    through which recipients can access the Corresponding Source.  
    
    @source: https://github.com/gka/chroma.js
###

root = (exports ? this)
chroma = root.chroma ?= {}

# Browserify-compatible export
module.exports = chroma if module?

chroma.version = "0.3.0"

class Color
	###
	data type for colors
	
	eg.
	new Color() // white
	new Color(120,.8,.5) // defaults to hsl color
	new Color([120,.8,.5]) // this also works
	new Color(255,100,50,'rgb') //  color using RGB
	new Color('#ff0000') // or hex value
	
	###
	constructor: (x,y,z,m) ->
		me = @
		
		if not x? and not y? and not z? and not m?
			x = [255,0,255]
			
		if type(x) == "array" and x.length == 3
			m ?= y
			[x,y,z] = x
		
		if type(x) == "string"
			m = 'hex'
		else 
			m ?= 'rgb'

		if m == 'rgb'
			me.rgb = [x,y,z]
		else if m == 'hsl'
			me.rgb = Color.hsl2rgb(x,y,z)
		else if m == 'hsv'
			me.rgb = Color.hsv2rgb(x,y,z)
		else if m == 'hex'
			me.rgb = Color.hex2rgb(x)
		else if m == 'lab'
			me.rgb = Color.lab2rgb(x,y,z)
		else if m == 'hcl'
			me.rgb = Color.hcl2rgb(x,y,z)
		else if m == 'hsi'
			me.rgb = Color.hsi2rgb(x,y,z)
		
		
	hex: ->
		Color.rgb2hex(@rgb)
		
	toString: ->
		@hex()
		
	hsl: ->
		Color.rgb2hsl(@rgb)
		
	hsv: ->
		Color.rgb2hsv(@rgb)
		
	lab: ->
		Color.rgb2lab(@rgb)
		
	hcl: ->
		Color.rgb2hcl(@rgb)
		
	hsi: ->
		Color.rgb2hsi(@rgb)
		
	interpolate: (f, col, m) ->
		###
		interpolates between colors
		###
		me = @
		m ?= 'rgb'
		col = new Color(col) if type(col) == "string"
		
		if m == 'hsl' or m == 'hsv' or m == 'hcl' or m == 'hsi'
			if m == 'hsl'
				xyz0 = me.hsl()
				xyz1 = col.hsl()
			else if m == 'hsv'
				xyz0 = me.hsv()
				xyz1 = col.hsv()
			else if m == 'hcl'
				xyz0 = me.hcl()
				xyz1 = col.hcl()
			else if m == 'hsi'
				xyz0 = me.hsi()
				xyz1 = col.hsi()
		
			[hue0, sat0, lbv0] = xyz0
			[hue1, sat1, lbv1] = xyz1
								
			if not isNaN(hue0) and not isNaN(hue1)
				if hue1 > hue0 and hue1 - hue0 > 180
					dh = hue1-(hue0+360)
				else if hue1 < hue0 and hue0 - hue1 > 180
					dh = hue1+360-hue0
				else
					dh = hue1 - hue0
				hue = hue0+f*dh
			else if not isNaN(hue0)
				hue = hue0
				sat = sat0 if lbv1 == 1 or lbv1 == 0
			else if not isNaN(hue1)
				hue = hue1
				sat = sat1 if lbv0 == 1 or lbv0 == 0
			else
				hue = undefined					
								
			sat ?= sat0 + f*(sat1 - sat0)

			lbv = lbv0 + f*(lbv1-lbv0)
			
			new Color(hue, sat, lbv, m)
			
		else if m == 'rgb'
			xyz0 = me.rgb
			xyz1 = col.rgb
			new Color(xyz0[0]+f*(xyz1[0]-xyz0[0]), xyz0[1] + f*(xyz1[1]-xyz0[1]), xyz0[2] + f*(xyz1[2]-xyz0[2]), m)
		
		else if m == 'lab'
			xyz0 = me.lab()
			xyz1 = col.lab()
			new Color(xyz0[0]+f*(xyz1[0]-xyz0[0]), xyz0[1] + f*(xyz1[1]-xyz0[1]), xyz0[2] + f*(xyz1[2]-xyz0[2]), m)
		
		else
			throw "color mode "+m+" is not supported"

Color.hex2rgb = (hex) ->
	if not hex.match /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
		if chroma.colors? and chroma.colors[hex]
			hex = chroma.colors[hex]
		else
			throw "unknown color format: "+hex
	if hex.length == 4 or hex.length == 7
		hex = hex.substr(1)
	if hex.length == 3
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]
	u = parseInt(hex, 16)
	r = u >> 16
	g = u >> 8 & 0xFF
	b = u & 0xFF
	[r,g,b]
	

Color.rgb2hex = (r,g,b) ->
	if r != undefined and r.length == 3
		[r,g,b] = r
	u = r << 16 | g << 8 | b
	str = "000000" + u.toString(16).toUpperCase()
	"#" + str.substr(str.length - 6)


Color.hsv2rgb = (h,s,v) ->
	if type(h) == "array" and h.length == 3
		[h,s,l] = h
	v *= 255
	if s is 0 and isNaN(h)
		r = g = b = v
	else
		h = 0 if h is 360
		h -= 360 if h > 360
		h += 360 if h < 0
		h /= 60
		i = Math.floor h
		f = h - i
		p = v * (1 - s)
		q = v * (1 - s * f)
		t = v * (1 - s * (1 - f))
		switch i
			when 0 then [r,g,b] = [v, t, p]
			when 1 then [r,g,b] = [q, v, p]
			when 2 then [r,g,b] = [p, v, t]
			when 3 then [r,g,b] = [p, q, v]
			when 4 then [r,g,b] = [t, p, v]
			when 5 then [r,g,b] = [v, p, q]	
	r = Math.round r
	g = Math.round g
	b = Math.round b
	[r, g, b]

	
Color.rgb2hsv = (r,g,b) ->
	if r != undefined and r.length == 3
		[r,g,b] = r
	min = Math.min(r, g, b)
	max = Math.max(r, g, b)
	delta = max - min
	v = max / 255.0
	s = delta / max
	if s is 0
		h = undefined
		s = 0
	else
		if r is max then h = (g - b) / delta
		if g is max then h = 2+(b - r) / delta
		if b is max then h = 4+(r - g) / delta
		h *= 60;
		if h < 0 then h += 360
	[h, s, v]


Color.hsl2rgb = (h,s,l) ->
	if h != undefined and h.length == 3
		[h,s,l] = h
	if s == 0
		r = g = b = l*255
	else
		t3 = [0,0,0]
		c = [0,0,0]
		t2 = if l < 0.5 then l * (1+s) else l+s-l*s
		t1 = 2 * l - t2
		h /= 360
		t3[0] = h + 1/3
		t3[1] = h
		t3[2] = h - 1/3
		for i in [0..2]
			t3[i] += 1 if t3[i] < 0
			t3[i] -= 1 if t3[i] > 1
			if 6 * t3[i] < 1
				c[i] = t1 + (t2 - t1) * 6 * t3[i]
			else if 2 * t3[i] < 1
				c[i] = t2
			else if 3 * t3[i] < 2
				c[i] = t1 + (t2 - t1) * ((2 / 3) - t3[i]) * 6
			else 
				c[i] = t1
		[r,g,b] = [Math.round(c[0]*255),Math.round(c[1]*255),Math.round(c[2]*255)]
	[r,g,b]	


Color.rgb2hsl = (r,g,b) ->
	if r != undefined and r.length == 3
		[r,g,b] = r
	r /= 255
	g /= 255
	b /= 255
	min = Math.min(r, g, b)
	max = Math.max(r, g, b)

	l = (max + min) / 2
	
	if max == min
		s = 0
		h = undefined
	else
		s = if l < 0.5 then (max - min) / (max + min) else (max - min) / (2 - max - min)

	if r == max then h = (g - b) / (max - min)
	else if (g == max) then h = 2 + (b - r) / (max - min)
	else if (b == max) then h = 4 + (r - g) / (max - min)
	
	h *= 60;
	h += 360 if h < 0
	[h,s,l]

#
# L*a*b* scale by David Dalrymple	
# http://davidad.net/colorviz/	
#
Color.lab2xyz = (l,a,b) ->
	###
	Convert from L*a*b* doubles to XYZ doubles
	Formulas drawn from http://en.wikipedia.org/wiki/Lab_color_spaces
	###
	if type(l) == "array" and l.length == 3
		[l,a,b] = l

	finv = (t) ->
		if t > (6.0/29.0) then t*t*t else 3*(6.0/29.0)*(6.0/29.0)*(t-4.0/29.0)
	sl = (l+0.16) / 1.16
	ill = [0.96421, 1.00000, 0.82519]
	y = ill[1] * finv(sl)
	x = ill[0] * finv(sl + (a/5.0))
	z = ill[2] * finv(sl - (b/2.0))
	[x,y,z]
	
Color.xyz2rgb = (x,y,z) ->
	###
	Convert from XYZ doubles to sRGB bytes
	Formulas drawn from http://en.wikipedia.org/wiki/Srgb
	###
	if type(x) == "array" and x.length == 3
		[x,y,z] = x
	
	rl =  3.2406*x - 1.5372*y - 0.4986*z
	gl = -0.9689*x + 1.8758*y + 0.0415*z
	bl =  0.0557*x - 0.2040*y + 1.0570*z
	clip = Math.min(rl,gl,bl) < -0.001 || Math.max(rl,gl,bl) > 1.001
	if clip
		rl = if rl<0.0 then 0.0 else if rl>1.0 then 1.0 else rl
		gl = if gl<0.0 then 0.0 else if gl>1.0 then 1.0 else gl
		bl = if bl<0.0 then 0.0 else if bl>1.0 then 1.0 else bl
	
	# Uncomment the below to detect clipping by making clipped zones red.
	if clip 
		[rl,gl,bl] = [undefined,undefined,undefined]
		
	correct = (cl) ->
		a = 0.055
		if cl<=0.0031308 then 12.92*cl else (1+a)*Math.pow(cl,1/2.4)-a
	
	r = Math.round 255.0*correct(rl)
	g = Math.round 255.0*correct(gl)
	b = Math.round 255.0*correct(bl)
	 
	[r,g,b]
	
Color.lab2rgb = (l,a,b) ->
	###
	Convert from LAB doubles to sRGB bytes 
	(just composing the above transforms)
	###
	if l != undefined and l.length == 3
		[l,a,b] = l

	if l != undefined and l.length == 3
		[l,a,b] = l
	[x,y,z] = Color.lab2xyz(l,a,b)
	Color.xyz2rgb(x,y,z)
	
	
Color.hcl2lab = (c,s,l) ->
	###
	Convert from a qualitative parameter c and a quantitative parameter l to a 24-bit pixel. These formulas were invented by David Dalrymple to obtain maximum contrast without going out of gamut if the parameters are in the range 0-1.
	
	A saturation multiplier was added by Gregor Aisch
	###
	if type(c) == "array" and c.length == 3
		[c,s,l] = c
		
	c /= 360.0
	TAU = 6.283185307179586476925287
	L = l*0.61+0.09 # L of L*a*b*
	angle = TAU/6.0-c*TAU
	r = (l*0.311+0.125)*s # ~chroma
	a = Math.sin(angle)*r
	b = Math.cos(angle)*r
	[L,a,b]
	

Color.hcl2rgb = (c,s,l) ->
	[L,a,b] = Color.hcl2lab(c,s,l)
	Color.lab2rgb(L,a,b)
	
	
Color.rgb2xyz = (r,g,b) ->
	if r != undefined and r.length == 3
		[r,g,b] = r
	
	correct = (c) ->
		a = 0.055
		if c <= 0.04045 then c/12.92 else Math.pow((c+a)/(1+a), 2.4)	
	
	rl = correct(r/255.0)
	gl = correct(g/255.0)
	bl = correct(b/255.0)
	
	x = 0.4124 * rl + 0.3576 * gl + 0.1805 * bl
	y = 0.2126 * rl + 0.7152 * gl + 0.0722 * bl
	z = 0.0193 * rl + 0.1192 * gl + 0.9505 * bl
	[x,y,z]
	
Color.xyz2lab = (x,y,z) ->
	# 6500K color templerature
	if x != undefined and x.length == 3
		[x,y,z] = x
		
	ill = [0.96421, 1.00000, 0.82519]	
	f = (t) ->
		if t > Math.pow(6.0/29.0,3) then Math.pow(t, 1/3) else (1/3)*(29/6)*(29/6)*t+4.0/29.0
	l = 1.16 * f(y/ill[1]) - 0.16
	a = 5 * (f(x/ill[0]) - f(y/ill[1]))
	b = 2 * (f(y/ill[1]) - f(z/ill[2])) 
	[l,a,b]
	
	
Color.rgb2lab = (r,g,b) ->
	if r != undefined and r.length == 3
		[r,g,b] = r
	[x,y,z] = Color.rgb2xyz(r,g,b)
	Color.xyz2lab(x,y,z)


Color.lab2hcl = (l,a,b) ->
	###
	Convert from a qualitative parameter c and a quantitative parameter l to a 24-bit pixel. These formulas were invented by David Dalrymple to obtain maximum contrast without going out of gamut if the parameters are in the range 0-1.
	
	A saturation multiplier was added by Gregor Aisch
	###
	if type(l) == "array" and l.length == 3
		[l,a,b] = l
	L = l
	l = (l-0.09) / 0.61
	
	r = Math.sqrt(a*a + b*b)
	s = r / (l*0.311+0.125)
	
	TAU = 6.283185307179586476925287
	
	angle = Math.atan2(a,b)
		
	c = (TAU/6 - angle) / TAU
	c *= 360
	c += 360 if c < 0
	
	[c,s,l]


Color.rgb2hcl = (r,g,b) ->
	if type(r) == "array" and r.length == 3
		[r,g,b] = r
	[l,a,b] = Color.rgb2lab(r,g,b)
	Color.lab2hcl(l,a,b)
	

Color.rgb2hsi = (r,g,b) ->
	###
	borrowed from here:
	http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/rgb2hsi.cpp
	###
	if type(r) == "array" and r.length == 3
		[r,g,b] = r
	TWOPI = Math.PI*2
	r /= 255
	g /= 255
	b /= 255
	min = Math.min(r,g,b)
	i = (r+g+b)/3
	s = 1 - min/i
	if s == 0
		h = 0
	else
		h = ((r-g)+(r-b)) / 2
		h /= Math.sqrt((r-g)*(r-g) + (r-b)*(g-b))
		h = Math.acos(h)
		if b > g
			h = TWOPI - h
		h /= TWOPI
	[h*360,s,i]	
	
	
Color.hsi2rgb = (h,s,i) ->
	###
	borrowed from here:
	http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/hsi2rgb.cpp
	###
	if type(h) == "array" and h.length == 3
		[h,s,i] = h
	TWOPI = Math.PI*2
	PITHIRD = Math.PI/3 
	cos = Math.cos
	
	# normalize hue
	h += 360 if h < 0
	h -= 360 if h > 360
	
	h /= 360
	if h < 1/3
		b = (1-s)/3
		r = (1+s*cos(TWOPI*h)/cos(PITHIRD-TWOPI*h))/3
		g = 1 - (b+r)
	else if h < 2/3
		h -= 1/3
		r = (1-s)/3
		g = (1+s*cos(TWOPI*h)/cos(PITHIRD-TWOPI*h))/3
		b = 1 - (r+g)
	else
		h -= 2/3
		g = (1-s)/3
		b = (1+s*cos(TWOPI*h)/cos(PITHIRD-TWOPI*h))/3
		r = 1 - (g+b)
	r = i*r*3
	g = i*g*3
	b = i*b*3
	[r*255,g*255,b*255]
	

chroma.Color = Color	

#
# static constructors
#

chroma.hsl = (h,s,l) ->
	new Color(h,s,l,'hsl')

chroma.hsv = (h,s,v) ->
	new Color(h,s,v,'hsv')

chroma.rgb = (r,g,b) ->
	new Color(r,g,b,'rgb')

chroma.hex = (x) ->
	new Color(x)
	
chroma.lab = (l,a,b) ->
	new Color(l,a,b,'lab')

chroma.hcl = (c,s,l) ->
	new Color(c,s,l,'hcl')
	
chroma.hsi = (h,s,i) ->
	new Color(h,s,i,'hsi')
	
chroma.interpolate = (a,b,f,m) ->
	a = new Color(a) if type(a) == 'string'
	b = new Color(b) if type(b) == 'string'
	a.interpolate(f,b,m)
	





class ColorScale
	###
	base class for color scales
	###
	constructor: (opts) ->
		me = @
		me.colors = cols = opts.colors ? ['#ddd', '#222']
		for c in [0..cols.length-1]
			col = cols[c]
			cols[c] = new Color(col) if type(col) == "string"
		
		if opts.positions?
			me.pos = opts.positions
		else
			me.pos = []
			for c in [0..cols.length-1]
				me.pos.push c/(cols.length-1)
		
		me.mode = opts.mode ? 'hsv'
		me.nacol = opts.nacol ? '#ccc'
		me.setClasses opts.limits ? [0,1]
		me
		
	
	getColor: (value) ->
		me = @
		if isNaN(value) then return me.nacol
		
		if me.classLimits.length > 2
			c = me.getClass value
			f = c/(me.numClasses-1)
			
		else
			f = f0 = (value - me.min) / (me.max - me.min)
			f = Math.min(1, Math.max(0, f))
		
		me.fColor f
		
		
	fColor: (f) ->
		me = @
		cols = me.colors
		for i in [0..me.pos.length-1]
			p = me.pos[i]
			if f <= p
				col = cols[i]
				break			
			if f >= p and i == me.pos.length-1
				col = cols[i]
				break
			if f > p and f < me.pos[i+1]
				f = (f-p)/(me.pos[i+1]-p)
				col = chroma.interpolate cols[i], cols[i+1], f, me.mode
				break
		col
	
		
	classifyValue: (value) ->
		self = @ 
		limits = self.classLimits
		if limits.length > 2
			n = limits.length-1
			i = self.getClass(value)
			value = limits[i] + (limits[i+1] - limits[i]) * 0.5			
			minc = limits[0]# + (limits[1]-limits[0])*0.3
			maxc = limits[n-1]# + (limits[n]-limits[n-1])*0.7
			value = self.min + ((value - minc) / (maxc-minc)) * (self.max - self.min)
		value
	
	
	setClasses: (limits = []) ->
		###
		# use this if you want to display a limited number of data classes
		# possible methods are "equalinterval", "quantiles", "custom"
		###
		me = @
		me.classLimits = limits
		me.min = limits[0]
		me.max = limits[limits.length-1]
		if limits.length == 2
			me.numClasses = 0
		else
			me.numClasses = limits.length-1
		
	getClass: (value) ->
		self = @ 
		limits = self.classLimits
		if limits?
			n = limits.length-1
			i = 0
			while i < n and value >= limits[i]
				i++
			return i-1
		return undefined
				
	validValue: (value) ->
		not isNaN(value)

chroma.ColorScale = ColorScale



class Ramp extends ColorScale
	
	constructor: (col0='#fe0000', col1='#feeeee', mode='hsl') ->
		super [col0,col1], [0,1], mode

chroma.Ramp = Ramp


class Diverging extends ColorScale
	
	constructor: (col0='#d73027', col1='#ffffbf', col2='#1E6189', center='mean', mode='hsl') ->
		me=@
		me.mode = mode
		me.center = center
		super [col0,col1,col2], [0,.5,1], mode
	
	parseData: (data, data_col) ->
		super data, data_col
		me = @
		c = me.center
		if c == 'median'
			c = me.median
		else if c == 'mean'
			c = me.mean	
		me.pos[1] = (c-me.min)/(me.max-me.min)
	

chroma.Diverging = Diverging


class Categories extends ColorScale

	constructor: (colors) ->
		# colors: dictionary of id: colors
		me = @
		me.colors = colors
		
	parseData: (data, data_col) ->
		# nothing to do here..
		
	getColor: (value) ->
		me = @
		if me.colors.hasOwnProperty value
			return me.colors[value]
		else
			return '#cccccc'
	
	validValue: (value) ->
		@colors.hasOwnProperty value
		
chroma.Categories = Categories


class CSSColors extends ColorScale

	constructor: (name) ->
		me = @
		me.name = name			
		me.setClasses(7)
		me
		
	getColor: (value) ->
		me = @
		c = me.getClass(value)
		me.name + ' l'+me.numClasses+' c'+c

chroma.CSSColors = CSSColors


# some pre-defined color scales:
chroma.scales ?= {}

chroma.scales.cool = ->
	new Ramp(chroma.hsl(180,1,.9), chroma.hsl(250,.7,.4))

chroma.scales.hot = ->
	new ColorScale
		colors: ['#000000','#ff0000','#ffff00','#ffffff']
		positions: [0,.25,.75,1]
		mode: 'rgb'
	
chroma.scales.BlWhOr = ->
	new Diverging(chroma.hsl(30,1,.55),'#ffffff', new Color(220,1,.55))

chroma.scales.GrWhPu = ->
	new Diverging(chroma.hsl(120,.8,.4),'#ffffff', new Color(280,.8,.4))


chroma.limits = (data, mode='equal', num=7, prop=null) ->
	min = Number.MAX_VALUE
	max = Number.MAX_VALUE*-1
	sum = 0
	values = []
	
	if type(data) == "array"
		if type(data[0]) != "object" and type(data[0]) != "array"
			for val in data
				values.push Number(val) if not isNaN val
		else
			for row in data
				values.push Number(row[prop])
	else if type(data) == "object"
		for k,val of data
			if type(val) == "object" and type(prop) == "string"
				values.push Number(val[prop]) if not isNaN val[prop]
			else if type(val) == "array" and type(prop) == "number"
				values.push Number(val[prop]) if not isNaN val[prop]
			else if type(val) == "number"
				values.push Number(val) if not isNaN val 
			
	for val in values
		if not not isNaN val 
			continue
		min = val if val < min
		max = val if val > max
		sum += val

	values = values.sort (a,b)->
		a-b
	
	limits = []
	
	
	if mode.substr(0,1) == 'c' # continuous
		limits.push min
		limits.push max
		
	if mode.substr(0,1) == 'e' # equal interval
		limits.push min
		for i in [1..num-1]
			limits.push min+(i/num)*(max-min) 
		limits.push max
		
	else if mode.substr(0,1) == 'q' # quantile scale
		limits.push min
		for i in [1..num-1] 
			p = values.length * i/num
			pb = Math.floor p
			if pb == p
				limits.push values[pb] 
			else # p > pb 
				pr = p - pb
				limits.push values[pb]*pr + values[pb+1]*(1-pr)
		limits.push max
		
	else if mode.substr(0,1) == 'k' # k-means clustering
		###
		implementation based on
		http://code.google.com/p/figue/source/browse/trunk/figue.js#336
		simplified for 1-d input values
		###
		n = values.length
		assignments = new Array n
		clusterSizes = new Array num
		repeat = true
		nb_iters = 0
		centroids = null
		
		# get seed values
		centroids = []
		centroids.push min
		for i in [1..num-1]
			centroids.push min + (i/num) * (max-min)
		centroids.push max
		
		while repeat
			# assignment step
			for j in [0..num-1]
				clusterSizes[j] = 0
			for i in [0..n-1]
				value = values[i]
				mindist = Number.MAX_VALUE
				for j in [0..num-1]
					dist = Math.abs centroids[j]-value
					if dist < mindist
						mindist = dist
						best = j
				clusterSizes[best]++
				assignments[i] = best
			
			# update centroids step
			newCentroids = new Array num
			for j in [0..num-1]
				newCentroids[j] = null
			for i in [0..n-1]
				cluster = assignments[i]
				if newCentroids[cluster] == null
					newCentroids[cluster] = values[i]
				else
					newCentroids[cluster] += values[i]
			for j in [0..num-1]
				newCentroids[j] *= 1/clusterSizes[j]
					
			# check convergence
			repeat = false
			for j in [0..num-1]
				if newCentroids[j] != centroids[i]
					repeat = true
					break
			
			centroids = newCentroids
			nb_iters++
			
			if nb_iters > 200
				repeat = false
				
		# finished k-means clustering
		# the next part is borrowed from gabrielflor.it
		kClusters = {}
		for j in [0..num-1]
			kClusters[j] = []
		for i in [0..n-1]
			cluster = assignments[i]
			kClusters[cluster].push values[i]
		tmpKMeansBreaks = []
		for j in [0..num-1]
			tmpKMeansBreaks.push kClusters[j][0]
			tmpKMeansBreaks.push kClusters[j][kClusters[j].length-1]
		tmpKMeansBreaks = tmpKMeansBreaks.sort (a,b)->
			a-b
		limits.push tmpKMeansBreaks[0]
		for i in [1..tmpKMeansBreaks.length-1] by 2
			if not isNaN(tmpKMeansBreaks[i])
				limits.push tmpKMeansBreaks[i]

	limits
	
	
		
