# @require utils lab2rgb rgb2lab

chroma.lab = () ->
    new Color arguments..., 'lab'

_input.lab = lab2rgb

Color::lab = () ->
    rgb2lab @_rgb


