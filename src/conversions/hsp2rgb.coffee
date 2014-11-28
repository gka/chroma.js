Pr = 0.299
Pg = 0.587
Pb = 0.114

hsp2rgb = () ->
    ###
    HSP color model
    Code from: http://alienryderflex.com/hsp.html
    ###
    [h,s,p] = unpack arguments

    if isNaN h
        h = 0

    h /= 360
    minOverMax = 1 - s

    if minOverMax > 0
        if h < 1/6
            #r > g > b
            h *= 6
            part = 1 + h * (1/minOverMax-1)

            b = p/Math.sqrt(Pr/minOverMax/minOverMax + Pg*part*part+Pb)
            r = b/minOverMax
            g = b + h * (r-b)
        else if h < 2/6
            #g > r > b
            h = 6 * (-h + 2/6)
            part = 1 + h * (1/minOverMax-1)

            b = p/Math.sqrt(Pg/minOverMax/minOverMax + Pr*part*part+Pb)
            g = b/minOverMax
            r = b + h * (g-b)
        else if h < 3/6
            #g > b > r
            h = 6 * (h - 2/6)
            part = 1 + h * (1/minOverMax-1)

            r = p/Math.sqrt(Pg/minOverMax/minOverMax + Pb*part*part+Pr)
            g = r/minOverMax
            b = r + h * (g-r)
        else if h < 4/6
            #b > g > r
            h = 6 * (-h + 4/6)
            part = 1 + h * (1/minOverMax-1)

            r = p/Math.sqrt(Pb/minOverMax/minOverMax + Pg*part*part+Pr)
            b = r/minOverMax
            g = r + h * (b-r)
        else if h < 5/6
            #b > r > g
            h = 6 * (h - 4/6)
            part = 1 + h * (1/minOverMax-1)

            g = p/Math.sqrt(Pb/minOverMax/minOverMax + Pr*part*part+Pg)
            b = g/minOverMax
            r = g + h * (b-g)
        else
            #r > b > g
            h = 6 * (-h + 1)
            part = 1 + h * (1/minOverMax-1)

            g = p/Math.sqrt(Pr/minOverMax/minOverMax + Pb*part*part+Pg);
            r = g/minOverMax
            b = g + h * (r-g)
    else
        if h < 1/6
            #r > g > b
            h *= 6

            r = Math.sqrt(p*p/(Pr+Pg*h*h))
            g = r * h
            b = 0
        else if h < 2/6
            #g > r > b
            h = 6 * (-h + 2/6)

            g = Math.sqrt(p*p/(Pg+Pr*h*h))
            r = g * h
            b = 0
        else if h < 3/6
            #g > b > r
            h = 6 * (h - 2/6)

            g = Math.sqrt(p*p/(Pg+Pb*h*h))
            b = g * h
            r = 0
        else if h < 4/6
            #b > g > r
            h = 6 * (-h + 4/6)

            b = Math.sqrt(p*p/(Pb+Pg*h*h))
            g = b * h
            r = 0
        else if h < 5/6
            #b > r > g
            h = 6 * (h - 4/6)

            b = Math.sqrt(p*p/(Pb+Pr*h*h))
            r = b * h
            g = 0
        else
            #r > b > g
            h = 6 * (-h + 1)

            r = Math.sqrt(p*p/(Pr+Pb*h*h))
            b = r * h
            g = 0

    r = Math.round(r * 255)
    g = Math.round(g * 255)
    b = Math.round(b * 255)
    [r, g, b]
