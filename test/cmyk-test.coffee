require 'es6-shim'
vows = require 'vows'
assert = require 'assert'
chroma = require '../chroma'

round = (digits) ->
    d = Math.pow 10,digits
    return (v) ->
        Math.round(v*d) / d

vows
    .describe('Testing CMYK color conversions')
    .addBatch

        'export simple colors to CMYK':
            topic: ['black','white','red','#0f0','blue','yellow','cyan','magenta','gray']
            'black':   (t) -> assert.deepEqual chroma(t[0]).cmyk(), [0,0,0,1]
            'white':   (t) -> assert.deepEqual chroma(t[1]).cmyk(), [0,0,0,0]
            'red':     (t) -> assert.deepEqual chroma(t[2]).cmyk(), [0,1,1,0]
            'green':   (t) -> assert.deepEqual chroma(t[3]).cmyk(), [1,0,1,0]
            'blue':    (t) -> assert.deepEqual chroma(t[4]).cmyk(), [1,1,0,0]
            'yellow':  (t) -> assert.deepEqual chroma(t[5]).cmyk(), [0,0,1,0]
            'cyan':    (t) -> assert.deepEqual chroma(t[6]).cmyk(), [1,0,0,0]
            'magenta': (t) -> assert.deepEqual chroma(t[7]).cmyk(), [0,1,0,0]
            'gray': (t) -> assert.deepEqual chroma(t[8]).cmyk().map(round(4)), [0,0,0,0.498]

        'parse simple CMYK colors':
            topic: [[0,0,0,1],[0,0,0,0],[0,1,1,0],[1,0,1,0],[1,1,0,0],[0,0,1,0],[1,0,0,0],[0,1,0,0]]
            'black':   (t) -> assert.equal chroma(t[0], 'cmyk').hex(), '#000000'
            'white':   (t) -> assert.equal chroma(t[1], 'cmyk').hex(), '#ffffff'
            'red':     (t) -> assert.equal chroma(t[2], 'cmyk').hex(), '#ff0000'
            'green':   (t) -> assert.equal chroma(t[3], 'cmyk').hex(), '#00ff00'
            'blue':    (t) -> assert.equal chroma(t[4], 'cmyk').hex(), '#0000ff'
            'yellow':  (t) -> assert.equal chroma(t[5], 'cmyk').hex(), '#ffff00'
            'cyan':    (t) -> assert.equal chroma(t[6], 'cmyk').hex(), '#00ffff'
            'magenta': (t) -> assert.equal chroma(t[7], 'cmyk').hex(), '#ff00ff'

        'alternative syntax':
            topic: [1,0,1,0]
            'array-mode': (cmyk) -> assert.equal chroma(cmyk, 'cmyk').hex(), '#00ff00'
            'values-mode': (cmyk) -> assert.equal chroma(cmyk...,'cmyk').hex(), '#00ff00'
            'shortcut 1': (cmyk) -> assert.equal chroma.cmyk(cmyk).hex(), '#00ff00'
            'shortcut 2': (cmyk) -> assert.equal chroma.cmyk(cmyk...).hex(), '#00ff00'

    .export(module)
