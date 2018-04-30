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

        'random colors with seed':
            topic: chroma.random().hex()
            'valid hex code': (topic) ->
                chroma.seedrandom(topic)
                assert /^#[0-9a-f]{6}$/i.test(chroma.random().hex())
            'deterministic results': (topic) ->
                chroma.seedrandom(topic)
                firstResult = chroma.random().hex()
                secondResult = chroma.random().hex()

                chroma.seedrandom(topic)
                assert.equal firstResult, chroma.random().hex()
                assert.equal secondResult, chroma.random().hex()

    .export(module)
