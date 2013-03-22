
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


    .export(module)