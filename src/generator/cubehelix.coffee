# cubehelix interpolation
# based on D.A. Green "A colour scheme for the display of astronomical intensity images"
# http://astron-soc.in/bulletin/11June/289392011.pdf

chroma.cubehelix = (start=300, rotations=-1.5, hue=1, gamma=1, lightness=[0,1]) ->
    dh = 0
    if type(lightness) == 'array'
        dl = lightness[1] - lightness[0]
    else
        dl = 0
        lightness = [lightness, lightness]

    f = (fract) ->
        a = TWOPI * ((start+120)/360 + rotations * fract)
        l = pow(lightness[0] + dl * fract, gamma)
        h = if dh != 0 then hue[0] + fract * dh else hue
        amp = h * l * (1-l) / 2
        cos_a = cos a
        sin_a = sin a
        r = l + amp * (-0.14861 * cos_a + 1.78277* sin_a)
        g = l + amp * (-0.29227 * cos_a - 0.90649* sin_a)
        b = l + amp * (+1.97294 * cos_a)
        chroma clip_rgb [r*255,g*255,b*255,1]

    f.start = (s) ->
        if not s? then return start
        start = s
        f

    f.rotations = (r) ->
        if not r? then return rotations
        rotations = r
        f

    f.gamma = (g) ->
        if not g? then return gamma
        gamma = g
        f

    f.hue = (h) ->
        if not h? then return hue
        hue = h
        if type(hue) == 'array'
            dh = hue[1] - hue[0]
            hue = hue[1] if dh == 0
        else
            dh = 0
        f

    f.lightness = (h) ->
        if not h? then return lightness
        if type(h) == 'array'
            lightness = h
            dl = h[1] - h[0]
        else
            lightness = [h,h]
            dl = 0
        f

    f.scale = () ->
        chroma.scale f

    f.hue hue

    f
