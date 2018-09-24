# @requires interpolate rgb utils

interpolate_lrgb = (col1, col2, f, m) ->
    xyz0 = col1._rgb
    xyz1 = col2._rgb
    new Color(
        sqrt(pow(xyz0[0],2) * (1-f) + pow(xyz1[0],2) * f),
        sqrt(pow(xyz0[1],2) * (1-f) + pow(xyz1[1],2) * f),
        sqrt(pow(xyz0[2],2) * (1-f) + pow(xyz1[2],2) * f),
        m
    )

_average_lrgb = (colors) ->
    f = 1/colors.length
    xyz = [0,0,0,0]
    for col in colors
        rgb = col._rgb
        xyz[0] += pow(rgb[0],2) * f
        xyz[1] += pow(rgb[1],2) * f
        xyz[2] += pow(rgb[2],2) * f
        xyz[3] += rgb[3] * f
    xyz[0] = sqrt(xyz[0])
    xyz[1] = sqrt(xyz[1])
    xyz[2] = sqrt(xyz[2])
    xyz[3] = 1 if xyz[3] > 1
    new Color clip_rgb xyz


_interpolators.push ['lrgb', interpolate_lrgb]

