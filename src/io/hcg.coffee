# @require utils hcg2rgb rgb2hcg

chroma.hcg = () ->
    new Color arguments..., 'hcg'

_input.hcg = hcg2rgb

Color::hcg = () ->
    rgb2hcg @_rgb