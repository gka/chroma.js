# @requires utils lab-constants

rgb2lab = () ->
    [r,g,b] = unpack arguments
    [x,y,z] = rgb2xyz r,g,b
    [116 * y - 16, 500 * (x - y), 200 * (y - z)]

rgb_xyz = (r) ->
    if (r /= 255) <= 0.04045 then r / 12.92 else pow((r + 0.055) / 1.055, 2.4)

xyz_lab = (t) ->
    if t > LAB_CONSTANTS.t3 then pow(t, 1 / 3) else t / LAB_CONSTANTS.t2 + LAB_CONSTANTS.t0

rgb2xyz = () ->
    [r,g,b] = unpack arguments
    r = rgb_xyz r
    g = rgb_xyz g
    b = rgb_xyz b
    x = xyz_lab (0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / LAB_CONSTANTS.Xn
    y = xyz_lab (0.2126729 * r + 0.7151522 * g + 0.0721750 * b) / LAB_CONSTANTS.Yn
    z = xyz_lab (0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / LAB_CONSTANTS.Zn
    [x,y,z]
