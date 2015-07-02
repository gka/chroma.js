# @require utils hsi2rgb rgb2hsi

chroma.hsi = () ->
    new Color arguments..., 'hsi'

_input.hsi = hsi2rgb

Color::hsi = () ->
    rgb2hsi @_rgb


