_random = Math.random

chroma.random = ->
    digits = '0123456789abcdef'
    code = '#'
    code += digits.charAt(floor(_random() * 16)) for i in [0...6]
    new Color code

chroma.seedrandom = (seed) ->
    try
        seed_random = require 'seedrandom'
    catch error
        throw 'seedrandom module required for random(seed)'
    _random = seed_random(seed)
