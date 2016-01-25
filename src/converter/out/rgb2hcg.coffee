
rgb2hcg = () ->
    [r,g,b] = unpack arguments
    min = Math.min(r, g, b)
    max = Math.max(r, g, b)
    delta = max - min
    c = delta * 100 / 255
    _g = min / (255 - delta) * 100
    if delta == 0
        h = Number.NaN
    else
        if r is max then h = (g - b) / delta
        if g is max then h = 2+(b - r) / delta
        if b is max then h = 4+(r - g) / delta
        h *= 60
        if h < 0 then h += 360
    [h, c, _g]
