# @requires utils

hcg2rgb = () ->
    args = unpack arguments
    [h,c,g] = args
    
    h = h / 180 * Math.PI
    h = h % (Math.PI * 2) / Math.PI * 3
    v = h % 1
    pure = [0, 0, 0]
    
    switch Math.floor(h)
        when 0 
            pure[0] = 1
            pure[1] = v
            pure[2] = 0
        when 1 
            pure[0] = 1 - v 
            pure[1] = 1 
            pure[2] = 0
        when 2 
            pure[0] = 0 
            pure[1] = 1 
            pure[2] = v 
        when 3 
            pure[0] = 0
            pure[1] = 1 - v
            pure[2] = 1
        when 4 
            pure[0] = v 
            pure[1] = 0 
            pure[2] = 1 
        else 
            pure[0] = 1 
            pure[1] = 0 
            pure[2] = 1 - v
    inv = 1.0 - c
    rgb = []
    rgb[0] = c * pure[0] + inv * (1.0 - g)
    rgb[1] = c * pure[1] + inv * (1.0 - g)
    rgb[2] = c * pure[2] + inv * (1.0 - g) 
	
    [r,g,b] = [round(rgb[0]*255),round(rgb[1]*255),round(rgb[2]*255)]
    if args.length > 3 then [r,g,b,args[3]] else [r,g,b]
