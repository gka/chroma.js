# @requires utils

rgb2hcg = (r, g, b) ->
    if r != undefined and r.length >= 3
        [r,g,b] = r
    r /= 255
    g /= 255
    b /= 255

    max = Math.max(Math.max(r, g), b)
    min = Math.min(Math.min(r, g), b)
    chroma = (max - min)
    grayscale = null
    hue = null
    
    if chroma < 1
        grayscale = min / (1 - chroma)
    else 
        grayscale = 0
        
    if chroma > 0 
        hue = ((if max == r then ((g - b) / chroma) % (6) else (if max == g then ((b - r) / chroma) + 2 else ((r - g) / chroma) + 4)) * (Math.PI / 3)) % (Math.PI * 2)
    else 
        hue = 0

    [hue % Math.PI*2 / Math.PI * 180, chroma, grayscale]