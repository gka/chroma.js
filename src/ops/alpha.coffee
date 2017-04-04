# @require color

Color::alpha = (a) ->
    if arguments.length
        return chroma.rgb([@_rgb[0], @_rgb[1], @_rgb[2], a])
    @_rgb[3]
