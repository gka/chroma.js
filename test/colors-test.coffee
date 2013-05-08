
vows = require 'vows'
assert = require 'assert'
chroma = require '../chroma'


vows
    .describe('Some tests for chroma.color()')

    .addBatch

        'named colors':
            topic: -> chroma.color 'red'
            'hex': (topic) -> assert.equal topic.hex(), '#ff0000'
            'rgb': (topic) -> assert.deepEqual topic.rgb(), [255,0,0]

        'hex colors':
            topic: -> chroma.color '#f00'
            'name': (topic) -> assert.equal topic.name(), 'red'
            'hex': (topic) -> assert.equal topic.hex(), '#ff0000'
            'rgb': (topic) -> assert.deepEqual topic.rgb(), [255,0,0]

        'hex color, no #':
            topic: -> chroma.color 'F00'
            'name': (topic) -> assert.equal topic.name(), 'red'
            'hex': (topic) -> assert.equal topic.hex(), '#ff0000'
            'rgb': (topic) -> assert.deepEqual topic.rgb(), [255,0,0]

        'modify colors':
            topic: -> chroma.color('F00')
            'darken': (topic) -> assert.equal topic.darken(10).hex(), '#dd0000'
            'darker': (topic) -> assert.equal topic.darker(10).hex(), '#dd0000'
            'brighten': (topic) -> assert.equal topic.brighten(10).hex(), '#ff3e20'
            'brighter': (topic) -> assert.equal topic.brighter(10).hex(), '#ff3e20'
            'saturate': (topic) -> assert.equal topic.saturate().hex(), '#ff0000'
            'desaturate': (topic) -> assert.equal topic.desaturate().hex(), '#ec3d23'

    .export(module)