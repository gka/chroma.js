
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
        Array.prototype.slice.call args
    else
        args[0]

clip_rgb = (rgb) ->
    rgb._clipped = false
    rgb._unclipped = rgb.slice(0)
    for i in [0...3]
        if i < 3
            rgb._clipped = true if rgb[i] < 0 or rgb[i] > 255
            rgb[i] = 0 if rgb[i] < 0
            rgb[i] = 255 if rgb[i] > 255
        else if i == 3
            rgb[i] = 0 if rgb[i] < 0
            rgb[i] = 1 if rgb[i] > 1
    delete rgb._unclipped if not rgb._clipped
    rgb

{PI, round, cos, floor, pow, log, sin, sqrt, atan2, max, abs} = Math
TWOPI = PI*2
PITHIRD = PI/3
DEG2RAD = PI / 180
RAD2DEG = 180 / PI
