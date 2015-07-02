###
@requires
    color
    utils
###

_interpolators = []

interpolate = (col1, col2, f=0.5, m='rgb') ->
    ###
    interpolates between colors
    f = 0 --> me
    f = 1 --> col
    ###
    col1 = chroma col1 if type(col1) != 'object'
    col2 = chroma col2 if type(col2) != 'object'

    for interpol in _interpolators
        if m == interpol[0]
            res = interpol[1] col1, col2, f, m
            break

    throw "color mode "+m+" is not supported" if not res?

    # interpolate alpha at last
    res.alpha col1.alpha() + f * (col2.alpha() - col1.alpha())
    res

chroma.interpolate = interpolate

Color::interpolate = (col2, f, m) ->
    interpolate @, col2, f, m

chroma.mix = interpolate
Color::mix = Color::interpolate