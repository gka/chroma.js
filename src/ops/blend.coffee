#
# interpolates between a set of colors uzing a bezier spline
# blend mode formulas taken from http://www.venture-ware.com/kevin/coding/lets-learn-math-photoshop-blend-modes/
#

# @require utils color

blend = (bottom, top, mode) ->
    if !blend[mode]
        throw 'unknown blend mode ' + mode
    blend[mode](bottom, top)

blend_f = (f) ->
    (bottom,top) ->
        c0 = chroma(top).rgb()
        c1 = chroma(bottom).rgb()
        chroma(f(c0,c1), 'rgb')

each = (f) ->
    (c0, c1) ->
        out = []
        for i in [0..3]
            out[i] = f(c0[i], c1[i])
        out

normal = (a,b) ->
    a

multiply = (a,b) ->
    a * b / 255

darken = (a,b) ->
    if a > b then b else a

lighten = (a,b) ->
    if a > b then a else b

screen = (a,b) ->
    255 * (1 - (1-a/255) * (1-b/255))

overlay = (a,b) ->
    if b < 128
        2 * a * b / 255
    else
        255 * (1 - 2 * (1 - a / 255 ) * ( 1 - b / 255 ))

burn = (a,b) ->
    255 * (1 - (1 - b / 255) / (a/255))

dodge = (a,b) ->
    return 255 if a == 255
    a = 255 * (b / 255) / (1 - a / 255)
    if a > 255 then 255 else a

# add = (a,b) ->
#     if (a + b > 255) then 255 else a + b

blend.normal = blend_f each normal
blend.multiply = blend_f each multiply
blend.screen = blend_f each screen
blend.overlay = blend_f each overlay
blend.darken = blend_f each darken
blend.lighten = blend_f each lighten
blend.dodge = blend_f each dodge
blend.burn = blend_f each burn
# blend.add = blend_f each add

chroma.blend = blend