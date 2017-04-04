# @require utils

_input.rgb = () ->
    (v for k,v of unpack arguments)

chroma.rgb = () ->
    new Color arguments..., 'rgb'

Color::rgb = (round=true) ->
    if round then @_rgb.map(Math.round).slice 0,3 else @_rgb.slice 0,3

Color::rgba = (round=true) ->
    return @_rgb.slice(0) if not round
    return [Math.round(@_rgb[0]), Math.round(@_rgb[1]), Math.round(@_rgb[2]), @_rgb[3]]

_guess_formats.push
    p: 3
    test: (n) ->
        a = unpack arguments
        return 'rgb' if type(a) == 'array' and a.length == 3
        return 'rgb' if a.length == 4 and type(a[3]) == "number" and a[3] >= 0 and a[3] <= 1
