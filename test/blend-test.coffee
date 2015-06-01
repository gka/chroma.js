require 'es6-shim'
vows = require 'vows'
assert = require 'assert'
chroma = require '../chroma'

vows
    .describe('Testing blend modes')
    .addBatch
        'multiply 1':
            topic: chroma.blend 'red', '#5a9f37', 'multiply'
            'is #5a0000': (topic) -> assert.equal topic.hex(), '#5a0000'

        'multiply 2':
            topic: chroma.blend '#33b16f', '#857590', 'multiply'
            'is #1a513e': (topic) -> assert.equal topic.hex(), '#1a513e'

        'screen':
            topic: chroma.blend '#b83d31', '#0da671', 'screen'
            'is #bbbb8c': (topic) -> assert.equal topic.hex(), '#bbbb8c'

        'overlay':
            topic: chroma.blend '#b83d31', '#0da671', 'overlay'
            'is #784f2b': (topic) -> assert.equal topic.hex(), '#784f2b'

    .export(module)
