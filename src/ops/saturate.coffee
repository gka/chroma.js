
Color::saturate = (amount=20) ->
    me = @
    lch = me.lch()
    lch[1] += amount
    lch[1] = 0 if lch[1] < 0 
    chroma.lch(lch).alpha(me.alpha())

Color::desaturate = (amount=20) ->
	@saturate -amount