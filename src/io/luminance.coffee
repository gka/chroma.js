# @requires rgb2luminance interpolate-rgb

Color::luminance = (lum, mode='rgb') ->
    if !arguments.length
        return rgb2luminance @_rgb

    # set luminance
    rgba = @_rgb
    if lum == 0
        rgba = [0,0,0,@_rgb[3]]
    else if lum == 1
        rgba = [255,255,255,@[3]]
    else
        cur_lum = rgb2luminance @_rgb
        eps = 1e-7
        max_iter = 20

        test = (l,h) ->
            m = l.interpolate(h, 0.5, mode)
            lm = m.luminance()
            if Math.abs(lum - lm) < eps or not max_iter--
                return m
            if lm > lum
                return test(l, m)
            return test(m, h)

        if cur_lum > lum
            rgba = test(chroma('black'), @).rgba()
        else
            rgba = test(@, chroma('white')).rgba()

    chroma(rgba).alpha(@alpha())
