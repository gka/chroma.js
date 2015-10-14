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
        hue = ((if max == rgb[0] then ((rgb[1] - rgb[2]) / chroma).mod(6) else (if max == rgb[1] then ((rgb[2] - rgb[0]) / chroma) + 2 else ((rgb[0] - rgb[1]) / chroma) + 4)) * (Math.PI / 3)).mod(Math.PI * 2)
    else 
        hue = 0

    [hue % Math.PI*2 / Math.PI * 180, chroma, grayscale]