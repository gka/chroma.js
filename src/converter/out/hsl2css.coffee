# @requires utils

rnd = (a) -> round(a*100)/100

hsl2css = (hsl, alpha) ->
    mode = if alpha < 1 then 'hsla' else 'hsl'
    hsl[0] = rnd(hsl[0] || 0)
    hsl[1] = rnd(hsl[1]*100) + '%'
    hsl[2] = rnd(hsl[2]*100) + '%'
    hsl[3] = alpha if mode == 'hsla'
    mode + '(' + hsl.join(',') + ')'