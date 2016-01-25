
hcg2rgb = () ->
    args = unpack arguments
    [h,c,_g] = args
    c = c / 100
    g = c / 100 * 255
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
        q = _g * (1 - c) + (1 - f) * c * 255
        t = _g * (1 - c) + (f) * c * 255
        _c = c * 255
        switch i
            when 0 then [r,g,b] = [_c, t, p]
            when 1 then [r,g,b] = [q, _c, p]
            when 2 then [r,g,b] = [p, _c, t]
            when 3 then [r,g,b] = [p, q, _c]
            when 4 then [r,g,b] = [t, p, _c]
            when 5 then [r,g,b] = [_c, p, q]
    r = round r
    g = round g
    b = round b
    [r, g, b, if args.length > 3 then args[3] else 1]