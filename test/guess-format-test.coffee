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

        'named colors':
            topic: chroma 'red'
            'hex': (topic) -> assert.equal topic.hex(), '#ff0000'
            'rgb': (topic) -> assert.deepEqual topic.rgb(), [255,0,0]

        'hex colors':
            topic: chroma '#f00'
            'name': (topic) -> assert.equal topic.name(), 'red'
            'hex': (topic) -> assert.equal topic.hex(), '#ff0000'
            'hex rgba': (topic) -> assert.equal topic.hex('rgba'), '#ff0000ff'
            'hex argb': (topic) -> assert.equal topic.hex('argb'), '#ffff0000'
            'rgb': (topic) -> assert.deepEqual topic.rgb(), [255,0,0]

        'hex color, no #':
            topic: chroma 'F00'
            'name': (topic) -> assert.equal topic.name(), 'red'
            'hex': (topic) -> assert.equal topic.hex(), '#ff0000'
            'rgb': (topic) -> assert.deepEqual topic.rgb(), [255,0,0]

        'css color rgb':
            topic: chroma 'rgb(255,0,0)'
            'hex': (topic) -> assert.equal topic.hex(), '#ff0000'

        'rgba css color':
            topic: chroma 'rgba(128,0,128,0.5)'
            'hex': (topic) -> assert.equal topic.hex(), '#800080'
            'alpha': (topic) -> assert.equal topic.alpha(), 0.5
            'css': (topic) -> assert.equal topic.css(), 'rgba(128,0,128,0.5)'

        'hsla css color':
            topic: chroma 'hsla(240,100%,50%,0.5)'
            'hex': (topic) -> assert.equal topic.hex(), '#0000ff'
            'alpha': (topic) -> assert.equal topic.alpha(), 0.5
            'css': (topic) -> assert.equal topic.css(), 'rgba(0,0,255,0.5)'

        'hsla color':
            topic: chroma 'lightsalmon'
            'css (default)': (topic) -> assert.equal topic.css(), 'rgb(255,160,122)'
            'css (rgb)': (topic) -> assert.equal topic.css('rgb'), 'rgb(255,160,122)'
            'css (hsl)': (topic) -> assert.equal chroma(topic.css('hsl')).name(), 'lightsalmon'
            'css (rgb-css)': (topic) -> assert.equal chroma(topic.css('rgb')).name(), 'lightsalmon'

        'rgb color':
            topic: chroma 255,0,0
            'hex': (topic) -> assert.equal topic.hex(), '#ff0000'

        'hsv black':
            topic: chroma('black').hsv()
            'hue is NaN': (topic) -> assert isNaN topic[0]
            'but hue is defined': (topic) -> assert topic[0]?

        'hsl black':
            topic: chroma('black').hsl()
            'hue is NaN': (topic) -> assert isNaN topic[0]
            'but hue is defined': (topic) -> assert topic[0]?
            'sat is 0': (topic) -> assert.equal topic[1], 0
            'lightness is 0': (topic) -> assert.equal topic[2], 0

        'constructing with array, but no mode':
            topic: chroma [255, 0, 0]
            'falls back to rgb': (topic) -> assert.equal topic.hex(), chroma([255, 0, 0],'rgb').hex()

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
