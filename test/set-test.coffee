require 'es6-shim'
vows = require 'vows'
assert = require 'assert'
chroma = require '../chroma'

vows
    .describe('Testing color.set')
    .addBatch
        'set hue':
            topic: chroma 'hotpink'
            'hue not zero': (topic) -> assert.equal topic.hsl()[0], 330
            'hue zero': (topic) -> assert.equal topic.set('hsl.h', 0).hsl()[0], 0


    .export(module)
