
chroma.average = (colors) ->
    r = g = b = a = 0
    l = colors.length
    for c in colors
    	rgba = chroma(c).rgba()
    	r += rgba[0]
    	g += rgba[1]
    	b += rgba[2]
    	a += rgba[3]
    new Color r/l, g/l, b/l, a/l
