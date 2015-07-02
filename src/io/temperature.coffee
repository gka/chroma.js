
# @requires utils rgb2temperature temperature2rgb

chroma.temperature = chroma.kelvin = () ->
    new Color arguments..., 'temperature'

_input.temperature = _input.kelvin = _input.K = temperature2rgb

Color::temperature = () ->
    rgb2temperature @_rgb

Color::kelvin = Color::temperature
