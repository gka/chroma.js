# @require utils hsv2rgb rgb2hsv

chroma.hsv = () ->
    new Color arguments..., 'hsv'

_input.hsv = hsv2rgb

Color::hsv = () ->
    rgb2hsv @_rgb