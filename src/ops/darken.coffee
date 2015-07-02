# @requires color

Color::darken = (amount=20) ->
    me = @
    lch = me.lch()
    lch[0] -= amount
    chroma.lch(lch).alpha(me.alpha())

Color::darker = Color::darken

Color::brighten = (amount=20) ->
    @darken -amount

Color::brighter = Color::brighten