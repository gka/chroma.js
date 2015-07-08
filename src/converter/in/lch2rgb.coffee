# @requires utils lch2lab

lch2rgb = () ->
    args = unpack arguments
    [l,c,h] = args
    [L,a,b] = lch2lab l,c,h
    [r,g,b] = lab2rgb L,a,b
    [limit(r,0,255), limit(g,0,255), limit(b,0,255), if args.length > 3 then args[3] else 1]
