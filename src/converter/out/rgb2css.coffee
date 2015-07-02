# @requires utils

rgb2css = (rgba) ->
    mode = if rgba[3] < 1 then 'rgba' else 'rgb'
    if mode == 'rgb'
        mode+'('+rgba.slice(0,3).map(round).join(',')+')'
    else if mode == 'rgba'
        mode+'('+rgba.slice(0,3).map(round).join(',')+','+rgba[3]+')'
    else

