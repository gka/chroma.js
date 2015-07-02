# @require utils

_input.gl = () ->
    rgb = (v for k,v of unpack arguments)
    for i in [0..2]
        rgb[i] *= 255
    rgb

chroma.gl = () ->
    new Color arguments..., 'gl'

Color::gl = () ->
    rgb = @_rgb
    [rgb[0]/255, rgb[1]/255, rgb[2]/255, rgb[3]]
