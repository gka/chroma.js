#
# @requires hex hex2rgb w3cx11
#

_input.named = (name) ->
    hex2rgb w3cx11[name]

_guess_formats.push
    p: 5,
    test: (n) ->
        'named' if arguments.length == 1 and w3cx11[n]?

Color::name = (n) ->
    if arguments.length
        @_rgb = hex2rgb w3cx11[n] if w3cx11[n]
        @_rgb[3] = 1
        @
    # resolve name from hex
    h = @hex()
    for k of w3cx11
        if h == w3cx11[k]
            return k
    h
