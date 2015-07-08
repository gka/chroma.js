# @requires utils

hsl2rgb = () ->
    args = unpack arguments
    [h,s,l] = args
    if s == 0
        r = g = b = l*255
    else
        t3 = [0,0,0]
        c = [0,0,0]
        t2 = if l < 0.5 then l * (1+s) else l+s-l*s
        t1 = 2 * l - t2
        h /= 360
        t3[0] = h + 1/3
        t3[1] = h
        t3[2] = h - 1/3
        for i in [0..2]
            t3[i] += 1 if t3[i] < 0
            t3[i] -= 1 if t3[i] > 1
            if 6 * t3[i] < 1
                c[i] = t1 + (t2 - t1) * 6 * t3[i]
            else if 2 * t3[i] < 1
                c[i] = t2
            else if 3 * t3[i] < 2
                c[i] = t1 + (t2 - t1) * ((2 / 3) - t3[i]) * 6
            else
                c[i] = t1
        [r,g,b] = [round(c[0]*255),round(c[1]*255),round(c[2]*255)]
    if args.length > 3 then [r,g,b,args[3]] else [r,g,b]
