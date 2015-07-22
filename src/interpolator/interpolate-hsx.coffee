# @requires interpolate hsl hsv hsi lch

interpolate_hsx = (col1, col2, f, m) ->
    if m == 'hsl'
        xyz0 = col1.hsl()
        xyz1 = col2.hsl()
    else if m == 'hsv'
        xyz0 = col1.hsv()
        xyz1 = col2.hsv()
    else if m == 'hsi'
        xyz0 = col1.hsi()
        xyz1 = col2.hsi()
    else if m == 'lch' or m == 'hcl'
        m = 'hcl'
        xyz0 = col1.hcl()
        xyz1 = col2.hcl()

    if m.substr(0, 1) == 'h'
        [hue0, sat0, lbv0] = xyz0
        [hue1, sat1, lbv1] = xyz1

    if not isNaN(hue0) and not isNaN(hue1)
        if hue1 > hue0 and hue1 - hue0 > 180
            dh = hue1-(hue0+360)
        else if hue1 < hue0 and hue0 - hue1 > 180
            dh = hue1+360-hue0
        else
            dh = hue1 - hue0
        hue = hue0+f*dh
    else if not isNaN(hue0)
        hue = hue0
        sat = sat0 if (lbv1 == 1 or lbv1 == 0) and m != 'hsv'
    else if not isNaN(hue1)
        hue = hue1
        sat = sat1 if (lbv0 == 1 or lbv0 == 0) and m != 'hsv'
    else
        hue = Number.NaN

    sat ?= sat0 + f*(sat1 - sat0)
    lbv = lbv0 + f*(lbv1-lbv0)
    res = chroma[m](hue, sat, lbv)

    
_interpolators = _interpolators.concat ([m, interpolate_hsx] for m in ['hsv','hsl','hsi','hcl','lch'])
