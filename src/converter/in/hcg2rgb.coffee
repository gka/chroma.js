
hcg2rgb = () ->
    args = unpack arguments
    [h,c,_g] = args
    c = c / 100
    g = g / 100 * 255
    _c = c * 255
    if c is 0
        r = g = b = _g
    else
        h = 0 if h is 360
        h -= 360 if h > 360
        h += 360 if h < 0
        h /= 60
        i = floor h
        f = h - i
        p = _g * (1 - c)
        q = p + _c * (1 - f)
        t = p + _c * f
        v = p + _c
        switch i
            when 0 then [r,g,b] = [v, t, p]
            when 1 then [r,g,b] = [q, v, p]
            when 2 then [r,g,b] = [p, v, t]
            when 3 then [r,g,b] = [p, q, v]
            when 4 then [r,g,b] = [t, p, v]
            when 5 then [r,g,b] = [v, p, q]
    [r, g, b, if args.length > 3 then args[3] else 1]