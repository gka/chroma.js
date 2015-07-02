# @require utils

_input.rgb = () ->
    (v for k,v of unpack arguments)

chroma.rgb = () ->
    new Color arguments..., 'rgb'

Color::rgb = ->
    @_rgb.slice 0,3

Color::rgba = ->
    @_rgb

_guess_formats.push
    p: 15
    test: (n) ->
        a = unpack arguments
        return 'rgb' if type(a) == 'array' and a.length == 3
        return 'rgb' if a.length == 4 and type(a[3]) == "number" and a[3] >= 0 and a[3] <= 1
