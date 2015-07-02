# @require utils hsl2rgb rgb2hsl

chroma.hsl = () ->
    new Color arguments..., 'hsl'

_input.hsl = hsl2rgb

Color::hsl = () ->
    rgb2hsl @_rgb


