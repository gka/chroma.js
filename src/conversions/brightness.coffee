
brightness = (r,g,b) ->
    # perceived brightness based on HSP model
    # see http://alienryderflex.com/hsp.html
    [r,g,b] = unpack arguments
    r /= 255
    g /= 255
    b /= 255
    Math.sqrt(0.299*r*r + 0.587*g*g + 0.114*b*b)
