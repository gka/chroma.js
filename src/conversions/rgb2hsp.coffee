
rgb2hsp = () ->
    ###
    HSP color model
    Explanation at: http://alienryderflex.com/hsp.html
    ###

    [r,g,b,a] = unpack arguments
    [h,s,v] = rgb2hsv r,g,b,a
    p = brightness r,g,b,a

    [h, s, p]
