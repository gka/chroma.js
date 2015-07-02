# @requires rgb2luminance interpolate-rgb

Color::luminance = (lum, mode='rgb') ->
    return rgb2luminance @_rgb if !arguments.length
    # set luminance
    if lum == 0 then @_rgb = [0,0,0,@_rgb[3]]
    else if lum == 1 then @_rgb = [255,255,255,@_rgb[3]]
    else
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

        cur_lum = rgb2luminance @_rgb
        @_rgb = (if cur_lum > lum then test(chroma('black'), @) else test(@, chroma('white'))).rgba()

    @
