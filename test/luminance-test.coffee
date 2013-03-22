vows = require 'vows'
assert = require 'assert'
chroma = require '../chroma'


vows
    .describe('Testing relative luminance')

    .addBatch

        'black':
            topic: -> chroma.color 'black'
            'lum = 0': (topic) -> assert.equal topic.luminance(), 0

        'white':
            topic: -> chroma.color 'white'
            'lum = 1': (topic) -> assert.equal topic.luminance(), 1

        'red':
            topic: -> chroma.color 'red'
            'lum = 0.21': (topic) -> assert.equal topic.luminance(), 0.2126

        'yellow brighter than blue':
            topic: -> [chroma.color('yellow').luminance(), chroma.color('blue').luminance()]
            'yellow > blue': (topic) -> assert topic[0] > topic[1]

        'green darker than red':
            topic: -> [chroma.color('green').luminance(), chroma.color('red').luminance()]
            'green < red': (topic) -> assert topic[0] < topic[1]


    .export(module)