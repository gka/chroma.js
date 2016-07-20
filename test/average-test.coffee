require 'es6-shim'
vows = require 'vows'
assert = require 'assert'
chroma = require '../chroma'

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
           'is #5a0000': (topic) -> assert.deepEqual topic.rgba(), [127.5, 0, 0, 0.5]
         
    .export(module)
