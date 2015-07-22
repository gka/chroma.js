# @requires utils

lab2lch = () ->
    [l, a, b] = unpack arguments
    c = sqrt(a * a + b * b)
    h = (atan2(b, a) * RAD2DEG + 360) % 360
    h = Number.NaN if round(c*10000) == 0
    [l, c, h]
