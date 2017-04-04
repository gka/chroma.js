
cmyk2rgb = () ->
    args = unpack arguments
    [c,m,y,k] = args
    alpha = if args.length > 4 then args[4] else 1
    return [0,0,0,alpha] if k == 1
    r = if c >= 1 then 0 else 255 * (1-c) * (1-k)
    g = if m >= 1 then 0 else 255 * (1-m) * (1-k)
    b = if y >= 1 then 0 else 255 * (1-y) * (1-k)
    [r,g,b,alpha]