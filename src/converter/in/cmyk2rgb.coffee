
cmyk2rgb = () ->
    [c,m,y,k] = unpack arguments
    return [0,0,0] if k == 1
    r = if c >= 1 then 0 else round 255 * (1-c) * (1-k)
    g = if m >= 1 then 0 else round 255 * (1-m) * (1-k)
    b = if y >= 1 then 0 else round 255 * (1-y) * (1-k)
    [r,g,b]