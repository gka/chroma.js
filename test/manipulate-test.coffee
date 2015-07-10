require 'es6-shim'
vows = require 'vows'
assert = require 'assert'
chroma = require '../chroma'

round = (digits) ->
    d = Math.pow 10,digits
    return (v) ->
        Math.round(v*d) / d

vows
    .describe('Some tests for chroma.color()')

    .addBatch

        'modify colors':
            topic: () -> chroma '#ff0000'
            'darken': (topic) -> assert.equal topic.darken().hex(), '#c20000'
            'darker': (topic) -> assert.equal topic.darker().hex(), '#c20000'
            'darken more': (topic) -> assert.equal topic.darker(2).hex(), '#890000'
            'darken too much': (topic) -> assert.equal topic.darker(10).hex(), '#000000'
            'brighten': (topic) -> assert.equal topic.brighten().hex(), '#ff5a36'
            'brighten too much': (topic) -> assert.equal topic.brighten(10).hex(), '#ffffff'
            'brighter': (topic) -> assert.equal topic.brighter().hex(), '#ff5a36'
            'saturate': (topic) -> assert.equal topic.saturate().hex(), '#ff0000'
            'desaturate': (topic) -> assert.equal topic.desaturate().hex(), '#ee3a20'
            'desaturate more': (topic) -> assert.equal topic.desaturate(2).hex(), '#db5136'
            'desaturate too much': (topic) -> assert.equal topic.desaturate(400).hex(), '#7f7f7f'

        'premultiply':
            topic: chroma 'rgba(32, 48, 96, 0.5)'
            'premultiply rgba': (topic) -> assert.deepEqual topic.premultiply().rgba(), [16, 24, 48, 0.5]
            'premultiply hex': (topic) -> assert.equal topic.premultiply().hex(), '#101830'
            'premultiply num': (topic) -> assert.equal topic.premultiply().num(), 0x101830

    .export(module)
