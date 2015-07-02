# @requires utils

num2rgb = (num) ->
    if type(num) == "number" && num >= 0 && num <= 0xFFFFFF
        r = num >> 16
        g = (num >> 8) & 0xFF
        b = num & 0xFF
        return [r,g,b,1]
    console.warn "unknown num color: "+num
    [0,0,0,1]