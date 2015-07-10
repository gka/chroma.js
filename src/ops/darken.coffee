# @requires color lab lab-constants

Color::darken = (amount=1) ->
    me = @
    lab = me.lab()
    lab[0] -= LAB_CONSTANTS.Kn * amount
    chroma.lab(lab).alpha(me.alpha())

Color::brighten = (amount=1) ->
    @darken -amount

Color::darker = Color::darken
Color::brighter = Color::brighten
