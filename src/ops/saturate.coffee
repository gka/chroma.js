# requrie lab-constants lch

Color::saturate = (amount=1) ->
    me = @
    lch = me.lch()
    lch[1] += amount * LAB_CONSTANTS.Kn
    lch[1] = 0 if lch[1] < 0 
    chroma.lch(lch).alpha(me.alpha())

Color::desaturate = (amount=1) ->
	@saturate -amount