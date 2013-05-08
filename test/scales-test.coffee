
vows = require 'vows'
assert = require 'assert'
chroma = require '../chroma'


vows
    .describe('Some tests for chroma.scale()')

    .addBatch

        'simple rgb scale (white-->black)':
            topic: -> chroma.scale ['white','black']
            'starts white': (topic) -> assert.equal topic(0).hex(), '#ffffff'
            'mid gray': (topic) -> assert.equal topic(0.5).hex(), '#7f7f7f'
            'ends black': (topic) -> assert.equal topic(1).hex(), '#000000'

        'simple hsv scale (white-->black)':
            topic: -> chroma.scale(['white','black']).mode('hsv')
            'starts white': (topic) -> assert.equal topic(0).hex(), '#ffffff'
            'mid gray': (topic) -> assert.equal topic(0.5).hex(), '#808080'
            'ends black': (topic) -> assert.equal topic(1).hex(), '#000000'

        'simple lab scale (white-->black)':
            topic: -> chroma.scale(['white','black']).mode('lab')
            'starts white': (topic) -> assert.equal topic(0).hex(), '#ffffff'
            'mid gray': (topic) -> assert.equal topic(0.5).hex(), '#777777'
            'ends black': (topic) -> assert.equal topic(1).hex(), '#000000'

        'colorbrewer scale':
            topic: -> chroma.scale 'RdYlGn'
            'starts white': (topic) -> assert.equal topic(0).hex(), '#a50026'
            'mid gray': (topic) -> assert.equal topic(0.5).hex(), '#ffffbf'
            'ends black': (topic) -> assert.equal topic(1).hex(), '#006837'

        'colorbrewer scale - domained':
            topic: -> chroma.scale('RdYlGn').domain([0, 100])
            'starts white': (topic) -> assert.equal topic(0).hex(), '#a50026'
            'foo': (topic) -> assert.notEqual topic(10).hex(), '#ffffbf'
            'mid gray': (topic) -> assert.equal topic(50).hex(), '#ffffbf'
            'ends black': (topic) -> assert.equal topic(100).hex(), '#006837'

        'colorbrewer scale - domained - classified':
            topic: -> chroma.scale('RdYlGn').domain([0, 100], 5)
            'starts white': (topic) -> assert.equal topic(0).hex(), '#a50026'
            '10': (topic) -> assert.equal topic(10).hex(), '#a50026'
            'mid gray': (topic) -> assert.equal topic(50).hex(), '#ffffbf'
            'ends black': (topic) -> assert.equal topic(100).hex(), '#006837'


    .export(module)