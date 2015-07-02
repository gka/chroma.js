#
# Based on implementation by Neil Bartlett
# https://github.com/neilbartlett/color-temperature
#

# @requires utils temperature2rgb

rgb2temperature = () ->
    [r,g,b] = unpack arguments
    minTemp = 1000
    maxTemp = 40000
    eps = 0.4
    while maxTemp - minTemp > eps
        temp = (maxTemp + minTemp) * 0.5
        rgb = temperature2rgb temp
        if (rgb[2] / rgb[0]) >= (b / r)
            maxTemp = temp
        else
            minTemp = temp
    round temp
