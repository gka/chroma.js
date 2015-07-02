# @requires utils css2rgb rgb2css hsl2css

_input.css = (h) ->
    css2rgb h

chroma.css = () ->
    new Color arguments..., 'css'

Color::css = (mode='rgb') ->
    if mode[0..2] == 'rgb'
        rgb2css @_rgb
    else if mode[0..2] == 'hsl'
        hsl2css @hsl(), @alpha()
