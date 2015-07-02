# @requires color rgb

Color::premultiply = ->
    rgb = @rgb()
    a = @alpha()
    chroma(rgb[0]*a, rgb[1]*a, rgb[2]*a, a)
