require 'es6-shim'
vows = require 'vows'
assert = require 'assert'
chroma = require '../chroma'


vows
    .describe('Some tests for random colors')

    .addBatch

        'random colors':
            topic: chroma.random()
            'valid hex code': (topic) -> assert /^#[0-9a-f]{6}$/i.test(topic.hex())

    .export(module)
