# requires lab-constants

lab2rgb = () ->
    args = unpack arguments
    [l,a,b] = args

    y = (l + 16) / 116
    x = if isNaN(a) then y else y + a / 500
    z = if isNaN(b) then y else y - b / 200

    y = LAB_CONSTANTS.Yn * lab_xyz y
    x = LAB_CONSTANTS.Xn * lab_xyz x
    z = LAB_CONSTANTS.Zn * lab_xyz z

    r = xyz_rgb 3.2404542 * x - 1.5371385 * y - 0.4985314 * z  # D65 -> sRGB
    g = xyz_rgb -0.9692660 * x + 1.8760108 * y + 0.0415560 * z
    b = xyz_rgb 0.0556434 * x - 0.2040259 * y + 1.0572252 * z

    [r,g,b,if args.length > 3 then args[3] else 1]


xyz_rgb = (r) ->
    255 * (if r <= 0.00304 then 12.92 * r else 1.055 * pow(r, 1 / 2.4) - 0.055)

lab_xyz = (t) ->
    if t > LAB_CONSTANTS.t1 then t * t * t else LAB_CONSTANTS.t2 * (t - LAB_CONSTANTS.t0)

