# @require utils rgb2cmyk cmyk2rgb

_input.cmyk = () ->
    [c,m,y,k] = unpack arguments
    cmyk2rgb c,m,y,k


chroma.cmyk = () ->
    new Color arguments..., 'cmyk'

Color::cmyk = () ->
    rgb2cmyk @_rgb