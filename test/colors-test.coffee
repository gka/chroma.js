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

        'hsv black':
            topic: chroma('black').hsv()
            'hue is NaN': (topic) -> assert isNaN topic[0]
            'but hue is defined': (topic) -> assert topic[0]?

        'toString':
            topic: chroma 'greenyellow'
            'explicit': (topic) -> assert.equal topic.toString(), '#adff2f'
            'implicit': (topic) -> assert.equal ''+topic, '#adff2f'
            'implicit2': (topic) -> assert.equal String(topic), '#adff2f'

        'constructing numeric color':
            topic: chroma.num 0xadff2f
            'color is red': (topic) -> assert.equal topic.name(), 'greenyellow'
            'alpha is 100%': (topic) -> assert.equal topic.alpha(), 1

        'normalize hue':
            topic: chroma.rgb(0,255,255).lch()
            'hue > 0': (topic) -> assert topic[2] >= 0
            'hue < 360': (topic) -> assert topic[2] <= 360

        'lab conversion red':
            topic: chroma('red').lab().map(round(3))
            'is right': (topic) -> assert.deepEqual topic, [53.241, 80.092, 67.203]

        'lab conversion blue':
            topic: chroma('blue').lab().map(round(3))
            'is right': (topic) -> assert.deepEqual topic, [32.297, 79.188, -107.86]

        'lab conversion green':
            topic: chroma('green').lab().map(round(3))
            'is right': (topic) -> assert.deepEqual topic, [46.227, -51.698, 49.897]

        'lab conversion yellow':
            topic: chroma('yellow').lab().map(round(3))
            'is right': (topic) -> assert.deepEqual topic, [97.139, -21.554, 94.478]

        'lab conversion magenta':
            topic: chroma('magenta').lab().map(round(3))
            'is right': (topic) -> assert.deepEqual topic, [60.324, 98.234, -60.825]

        'hueless css hsl colors':
            topic: [chroma('black'), chroma('gray'), chroma('white')]
            'black': (topic) -> assert.equal topic[0].css('hsl'), 'hsl(0,0%,0%)'
            'gray': (topic) -> assert.equal topic[1].css('hsl'), 'hsl(0,0%,50.2%)'
            'white': (topic) -> assert.equal topic[2].css('hsl'), 'hsl(0,0%,100%)'

        'hcl.h is NaN for hue-less colors':
            topic: [chroma('black'), chroma('gray'), chroma('white')]
            'black': (topic) -> assert.isNaN topic[0].hcl()[0]
            'gray': (topic) -> assert.isNaN topic[1].hcl()[0]
            'white': (topic) -> assert.isNaN topic[2].hcl()[0]

        'lab-rgb precision':
            topic: [74, 24, 78],
            'to_rgb_to_lab': (topic) -> assert.deepEqual chroma.rgb(chroma.lab(topic).rgb(false)).lab().map(round(3)), topic

        'cmyk-rgb precision':
            topic: [0, 1, 1, 0.02],
            'to_rgb_to_cmyk': (topic) -> assert.deepEqual chroma.rgb(chroma.cmyk(topic).rgb(false)).cmyk().map(round(3)), topic

        'auto-detect rgba in hex output':
            topic: ['rgba(255,0,0,1)', 'rgba(255,0,0,0.5)']
            'rgb if alpha == 1': (topic) -> assert.equal chroma(topic[0]).hex(), '#ff0000'
            'rgba if alpha != 1': (topic) -> assert.equal chroma(topic[1]).hex(), '#ff000080'

    .export(module)
