require 'es6-shim'
vows = require 'vows'
assert = require 'assert'
chroma = require '../chroma'


vows
    .describe('Some tests for chroma.color()')

    .addBatch

        'hsv interpolation white <-> red':
            topic: chroma('white').interpolate('red', 0.5, 'hsv')
            'works': (topic) -> assert.deepEqual topic.hex(), '#ff8080'

        'use mix as alias':
            topic: chroma('white').mix('red', 0.5, 'hsv')
            'works': (topic) -> assert.deepEqual topic.hex(), '#ff8080'

        'alternative mix syntax':
            topic: chroma.mix('red', 'blue', 0.25)
            'works': (topic) -> assert.deepEqual topic.hex(), '#bf0040'

        'hsl interpolation white <-> red':
            topic: chroma('white').interpolate('red', 0.5, 'hsl')
            'works': (topic) -> assert.deepEqual topic.hex(), '#ff8080'

        'rgb interpolation white <-> red':
            topic: chroma('white').interpolate('red', 0.5, 'rgb')
            'works': (topic) -> assert.deepEqual topic.hex(), '#ff8080'

        'hsv interpolation red <-> white':
            topic: chroma('red').interpolate('white', 0.5, 'hsv')
            'works': (topic) -> assert.deepEqual topic.hex(), '#ff8080'

        'hsl interpolation red <-> white':
            topic: chroma('red').interpolate('white', 0.5, 'hsl')
            'works': (topic) -> assert.deepEqual topic.hex(), '#ff8080'

        'rgb interpolation red <-> white':
            topic: chroma('red').interpolate('white', 0.5, 'rgb')
            'works': (topic) -> assert.deepEqual topic.hex(), '#ff8080'

        'interpolation short function':
            topic:
                f: (t) -> chroma.interpolate('#ff0000', '#ffffff', t, 'hsv').hex()
            'starts at red': (topic) -> assert.equal topic.f(0), '#ff0000'
            'goes over light red': (topic) -> assert.equal topic.f(0.5), '#ff8080'
            'ends at white': (topic) -> assert.equal topic.f(1), '#ffffff'

        'num interpolation white <-> red':
            topic: chroma(0xffffff).interpolate(0xff0000, 0.5, 'num')
            'works': (topic) -> assert.deepEqual topic.hex(), '#ff7fff'

        'num interpolation red <-> white':
            topic: chroma(0xff0000).interpolate(0xffffff, 0.5, 'num')
            'works': (topic) -> assert.deepEqual topic.hex(), '#ff7fff'

        'interpolation short function with num provided':
            topic:
                f: (t) -> chroma.interpolate(0xff0000, 0xffffff, t, 'num').hex()
            'starts at red': (topic) -> assert.equal topic.f(0), '#ff0000'
            'goes over light red': (topic) -> assert.equal topic.f(0.5), '#ff7fff'
            'ends at white': (topic) -> assert.equal topic.f(1), '#ffffff'

        'interpolate in num':
            topic: chroma.interpolate chroma.num(0xffffe0), chroma.num(0x102180), 0.5, 'num'
            'hex': (topic) -> assert.equal topic.hex(), '#8810b0'
            'num': (topic) -> assert.equal topic.num(), 8917168

        'interpolate in hsv':
            topic: chroma.interpolate 'white', 'black', 0.5, 'hsv'
            'hex': (topic) -> assert.equal topic.hex(), '#808080'

        'interpolate in hsl':
            topic: chroma.interpolate 'lightyellow', 'navy', 0.5, 'hsl'
            'hex': (topic) -> assert.equal topic.hex(), '#31ff98'


    .export(module)
