require 'es6-shim'
vows = require 'vows'
assert = require 'assert'
chroma = require '../chroma'

vows
    .describe('Some tests for chroma.num()')

    .addBatch

        'number output':
            topic: chroma.hsl 0,1,0.5,0.5
            'numoutput': -> (topic) -> assert.equal topic.num(), 0xff0000

        'num color':
            topic: [chroma(0xff0000), chroma(0x000000), chroma(0xffffff), chroma(0x31ff98), chroma('red')]
            'hex': (topic) -> assert.equal topic[0].hex(), '#ff0000'
            'num': (topic) -> assert.equal topic[0].num(), 0xff0000
            'hex-black': (topic) -> assert.equal topic[1].hex(), '#000000'
            'num-black': (topic) -> assert.equal topic[1].num(), 0x000000
            'hex-white': (topic) -> assert.equal topic[2].hex(), '#ffffff'
            'num-white': (topic) -> assert.equal topic[2].num(), 0xffffff
            'hex-rand': (topic) -> assert.equal topic[3].hex(), '#31ff98'
            'num-rand': (topic) -> assert.equal topic[3].num(), 0x31ff98
            'rum-red': (topic) -> assert.equal topic[4].num(), 0xff0000

    .export(module)
