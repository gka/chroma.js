# @require hex2rgb rgb2hex

_input.hex = (h) ->
    hex2rgb h

chroma.hex = () ->
    new Color arguments..., 'hex'

Color::hex = (mode='rgb') ->
    rgb2hex @_rgb, mode

_guess_formats.push
    p: 4,
    test: (n) ->
        'hex' if arguments.length == 1 and type(n) == "string"
