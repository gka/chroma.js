
Color::set = (modechan, value) ->
    me = @
    [mode,channel] = modechan.split '.'
    if channel
        src = me[mode]()
        i = mode.indexOf channel
        if i > -1
            if type(value) == 'string'
                switch value.charAt(0)
                    when '+' then src[i] += +value
                    when '-' then src[i] += +value
                    when '*' then src[i] *= +(value.substr(1))
                    when '/' then src[i] /= +(value.substr(1))
                    else src[i] = +value
            else
                src[i] = value
        else
            console.warn 'unknown channel '+channel+' in mode '+mode
    else
        src = value
    chroma(src, mode).alpha(me.alpha())

