
rgb2num = () ->
    [r,g,b] = unpack arguments
    (r << 16) + (g << 8) + b
