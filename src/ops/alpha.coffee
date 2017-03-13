# @require color

Color::alpha = (a) ->
    if arguments.length
        r = @_rgb[0]
        g = @_rgb[1]
        b = @_rgb[2]
        return chroma.rgb([r, g, b, a])
    @_rgb[3]
