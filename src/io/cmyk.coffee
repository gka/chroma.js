# @require utils rgb2cmyk cmyk2rgb

_input.cmyk = () ->
    cmyk2rgb unpack arguments


chroma.cmyk = () ->
    new Color arguments..., 'cmyk'

Color::cmyk = () ->
    rgb2cmyk @_rgb