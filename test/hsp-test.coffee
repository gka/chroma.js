require 'es6-shim'
vows = require 'vows'
assert = require 'assert'
chroma = require '../chroma'


vows
    .describe('Testing relative luminance')

    .addBatch

        'red':
            topic: chroma('red')
            'rgb to hsp': (topic) -> assert.deepEqual topic.hsp(), [0, 1, 0.5468089245796927]
            'hsp to rgb': (topic) -> assert.deepEqual chroma(topic.hsp(), 'hsp').rgb(), [255, 0, 0]

        'azure':
            topic: chroma('azure')
            'rgb to hsp': (topic) -> assert.deepEqual topic.hsp(), [180, 0.058823529411764705, 0.9827808155880381]
            'hsp to rgb': (topic) -> assert.deepEqual chroma(topic.hsp(), 'hsp').rgb(), [240, 255, 255]

        'black':
            topic: chroma('black')
            'rgb to hsp hue': (topic) -> assert isNaN topic.hsp()[0]
            'rgb to hsp sat': (topic) -> assert.equal topic.hsp()[1], 0
            'rgb to hsp bri': (topic) -> assert.equal topic.hsp()[2], 0
            'hsp to rgb': (topic) -> assert.deepEqual chroma(topic.hsp(), 'hsp').rgb(), [0, 0, 0]

        'white':
            topic: chroma('white')
            'rgb to hsp hue': (topic) -> assert isNaN topic.hsp()[0]
            'rgb to hsp sat': (topic) -> assert.equal topic.hsp()[1], 0
            'rgb to hsp bri': (topic) -> assert.equal topic.hsp()[2], 0.9999999999999999
            'hsp to rgb': (topic) -> assert.deepEqual chroma(topic.hsp(), 'hsp').rgb(), [255, 255, 255]

    .export(module)
