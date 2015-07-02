
rgb2cmyk = (mode='rgb') ->
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
