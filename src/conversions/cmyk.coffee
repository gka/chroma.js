
rgb2cmyk = () ->
	[r,g,b] = unpack arguments
	r = r / 255
	g = g / 255
	b = b / 255
	k = 1 - Math.max(r,Math.max(g,b))
	f = if k < 1 then 1 / (1-k) else 0
	c = (1-r-k) * f
	m = (1-g-k) * f
	y = (1-b-k) * f
	[c,m,y,k]


cmyk2rgb = () ->
	[c,m,y,k] = unpack arguments
	return [0,0,0] if k == 1
	r = if c >= 1 then 0 else round 255 * (1-c) * (1-k)
	g = if m >= 1 then 0 else round 255 * (1-m) * (1-k)
	b = if y >= 1 then 0 else round 255 * (1-y) * (1-k)
	[r,g,b]