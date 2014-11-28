require 'es6-shim'
vows = require 'vows'
assert = require 'assert'
chroma = require '../chroma'


vows
    .describe('Testing relative luminance')

    .addBatch

        'black':
            topic: -> chroma.color 'black'
            'lum = 0': (topic) -> assert.equal topic.brightness(), 0

        'white':
            topic: -> chroma.color 'white'
            'lum = 1': (topic) -> assert.equal topic.brightness(), 0.9999999999999999

        'red':
            topic: -> chroma.color 'red'
            'lum = 0.55': (topic) -> assert.equal topic.brightness(), 0.5468089245796927

        'yellow brighter than blue':
            topic: -> [chroma.color('yellow').brightness(), chroma.color('blue').brightness()]
            'yellow > blue': (topic) -> assert topic[0] > topic[1]

        'green darker than red':
            topic: -> [chroma.color('green').brightness(), chroma.color('red').brightness()]
            'green < red': (topic) -> assert topic[0] < topic[1]


    .export(module)
