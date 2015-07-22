require 'es6-shim'
vows = require 'vows'
assert = require 'assert'
chroma = require '../chroma'

vows
    .describe('Testing color.get')
    .addBatch
        'get hue':
            topic: chroma 'hotpink'
            'hue not zero': (topic) -> assert.equal topic.hsl()[0], topic.get('hsl.h')


    .export(module)
