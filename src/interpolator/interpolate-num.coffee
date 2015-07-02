# @requires interpolate num

interpolate_num = (col1, col2, f, m) ->
    n1 = col1.num()
    n2 = col2.num()
    chroma.num n1 + (n2-n1) * f, 'num'

_interpolators.push ['num', interpolate_num]
