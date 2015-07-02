require 'es6-shim'
vows = require 'vows'
assert = require 'assert'
chroma = require '../chroma'


vows
    .describe('Some tests for gl colors')

    .addBatch

        'gl color':
            topic: chroma.gl 1,0,0
            'name': (topic) -> assert.equal topic.name(), 'red'
            'hex': (topic) -> assert.equal topic.hex(), '#ff0000'
            'rgb': (topic) -> assert.deepEqual topic.rgb(), [255,0,0]

        'gl color non-1':
            topic: chroma.gl 1,0.5,0.2
            'hex': (topic) -> assert.equal topic.hex(), '#ff7f33'
            'rgb': (topic) -> assert.deepEqual topic.rgb(), [255,127.5,51]

        'gl color w/ alpha':
            topic: chroma.gl 0,0,1,0.5
            'rgba': (topic) -> assert.deepEqual topic.rgba(), [0,0,255,0.5]

    .export(module)
