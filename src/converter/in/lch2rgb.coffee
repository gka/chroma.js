# @requires utils lch2lab

lch2rgb = () ->
    args = unpack arguments
    [l,c,h] = args
    [L,a,b] = lch2lab l,c,h
    [r,g,b] = lab2rgb L,a,b
    [r, g, b, if args.length > 3 then args[3] else 1]
