# @require utils num2rgb rgb2num

chroma.num = (num) ->
    new Color num, 'num'

Color::num = () ->
    rgb2num @_rgb

_input.num = num2rgb

_guess_formats.push
    p: 10,
    test: (n) ->
        'num' if arguments.length == 1 and type(n) == "number" and n >= 0 and n <= 0xFFFFFF