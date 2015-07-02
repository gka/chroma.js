# @require utils lch2rgb rgb2lch

chroma.lch = () ->
    args = unpack arguments
    new Color args, 'lch'

chroma.hcl = () ->
    args = unpack arguments
    new Color args, 'hcl'

_input.lch = lch2rgb

_input.hcl = () ->
    [h,c,l] = unpack arguments
    lch2rgb [l,c,h]

Color::lch = () ->
    rgb2lch @_rgb

Color::hcl = () ->
    rgb2lch(@_rgb).reverse()


