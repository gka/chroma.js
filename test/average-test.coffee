require 'es6-shim'
vows = require 'vows'
assert = require 'assert'
chroma = require '../chroma'


colors = [[125,133,127], [131,127,134], [138,121,141], [144,114,147], [149,107,153],
    [165,83,170], [160,92,164], [170,73,175], [175,62,180], [155,100,159]]

vows
    .describe('Testing color averaging modes')
    .addBatch
        'avg some colors':
            topic: ['red', 'blue']
            'is #5a0000': (topic) -> assert.equal chroma.average(topic).hex(), chroma.mix(topic[0], topic[1]).hex()
        'three colors':
            topic: chroma.average(['blue', 'red', 'white'])
            'is #5a0000': (topic) -> assert.equal topic.hex(), '#aa55aa'
        'alpha avg':
           topic: chroma.average(['rgba(0,0,0,0)', 'red'])
           'is #5a0000': (topic) -> assert.deepEqual topic.rgba(), [128, 0, 0, 0.5]
           'is #5a0000-2': (topic) -> assert.deepEqual topic.rgba(false), [127.5, 0, 0, 0.5]
        'average in lab':
            topic: chroma.average(['blue', 'red', 'white'], 'lab')
            'is #5a0000': (topic) -> assert.equal topic.hex(), '#e26daf'
        'average h in lch':
            topic: chroma.average([chroma.lch(50, 50, 0), chroma.lch(50, 50, 90)], 'lch').get('lch.h')
            'is approximately 45': (topic) -> assert.equal Math.round(topic), 45
        'average in hsl of same colors':
            topic: chroma.average(['#02c03a', '#02c03a'], 'hsl')
            'is same': (topic) -> assert.equal topic.hex(), '#02c03a'
        'average same color':
            topic: chroma.average(["#02c03a", "#02c03a"],'hsl')
            'is #02c03a': (topic) -> assert.equal topic.hex(), '#02c03a'
        'lrgb avergage':
            topic: chroma.average(colors, 'lrgb')
            'is ???': (topic) -> assert.equal topic.hex(), '#9b649f'

    .export(module)
