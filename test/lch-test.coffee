require 'es6-shim'
vows = require 'vows'
assert = require 'assert'
chroma = require '../chroma'

vows
    .describe('Some tests for chroma.lch()')

    .addBatch

        'lch grayscale':
            topic: ([l,0,0] for l in [0,100,25,50,75])
            'black': (t) -> assert.equal chroma.lch(t[0]).hex(), '#000000'
            'white': (t) -> assert.equal chroma.lch(t[1]).hex(), '#ffffff'
            'gray 1': (t) -> assert.equal chroma.lch(t[2]).hex(), '#3b3b3b'
            'gray 2': (t) -> assert.equal chroma.lch(t[3]).hex(), '#777777'
            'gray 3': (t) -> assert.equal chroma.lch(t[4]).hex(), '#b9b9b9'

        'lch hues':
            topic: ([50,70,h] for h in [0,60,120,180,240,300])
            'red-ish': (t) -> assert.equal chroma.lch(t[0]).hex(), '#dc2c7a'
            'yellow-ish': (t) -> assert.equal chroma.lch(t[1]).hex(), '#bd5c00'
            'green-ish': (t) -> assert.equal chroma.lch(t[2]).hex(), '#548400'
            'teal-ish': (t) -> assert.equal chroma.lch(t[3]).hex(), '#009175'
            'blue-ish': (t) -> assert.equal chroma.lch(t[4]).hex(), '#008cde'
            'purple-ish': (t) -> assert.equal chroma.lch(t[5]).hex(), '#6f67df'

        'clipping':
            topic: (chroma.hcl(50, 40, l) for l in [20,40,60,80,100])
            '20-clipped': (t) -> assert.equal t[0].clipped(), true
            '40-not clipped': (t) -> assert.equal t[1].clipped(), false
            '60-not clipped': (t) -> assert.equal t[2].clipped(), false
            '80-clipped': (t) -> assert.equal t[3].clipped(), true
            '100-clipped': (t) -> assert.equal t[4].clipped(), true

    .export(module)
