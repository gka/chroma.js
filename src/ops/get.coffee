
Color::get = (modechan) ->
    me = @
    [mode,channel] = modechan.split '.'
    src = me[mode]()
    if channel
        i = mode.indexOf channel
        if i > -1
            return src[i]
        else
            console.warn 'unknown channel '+channel+' in mode '+mode
    else
        return src

