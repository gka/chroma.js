
type = do ->
    ###
    for browser-safe type checking+
    ported from jQuery's $.type
    ###
    classToType = {}
    for name in "Boolean Number String Function Array Date RegExp Undefined Null".split(" ")
        classToType["[object " + name + "]"] = name.toLowerCase()

    (obj) ->
        strType = Object::toString.call(obj)
        classToType[strType] or "object"


limit = (x, min=0, max=1) ->
    x = min if x < min
    x = max if x > max
    x

unpack = (args) ->
    if args.length >= 3
        [].slice.call args
    else
        args[0]

clip_rgb = (rgb) ->
    for i of rgb
        if i < 3
            rgb[i] = 0 if rgb[i] < 0
            rgb[i] = 255 if rgb[i] > 255
        else if i == 3
            rgb[i] = 0 if rgb[i] < 0
            rgb[i] = 1 if rgb[i] > 1
    rgb

{PI, round, cos, floor, pow, log, sin, sqrt, atan2, max, abs} = Math
TWOPI = PI*2
PITHIRD = PI/3
DEG2RAD = PI / 180
RAD2DEG = 180 / PI
