require 'es6-shim'
vows = require 'vows'
assert = require 'assert'
chroma = require '../chroma'

test = vows.describe('Testing color conversions')

for k of chroma.colors
    test.addBatch
        k:
            topic: chroma.colors[k]
            'to hsl and back': (t) -> assert.equal chroma.hsl(chroma(t).hsl()).hex(), t
            'to cmyk and back': (t) -> assert.equal chroma.cmyk(chroma(t).cmyk()).hex(), t
            'to css and back': (t) -> assert.equal chroma.css(chroma(t).css()).hex(), t
            'to hsi and back': (t) -> assert.equal chroma.hsi(chroma(t).hsi()).hex(), t
            'to hsl and back': (t) -> assert.equal chroma.hsl(chroma(t).hsl()).hex(), t
            'to hsv and back': (t) -> assert.equal chroma.hsv(chroma(t).hsv()).hex(), t
            'to lab and back': (t) -> assert.equal chroma.lab(chroma(t).lab()).hex(), t
            'to lch and back': (t) -> assert.equal chroma.lch(chroma(t).lch()).hex(), t
            'to num and back': (t) -> assert.equal chroma.num(chroma(t).num()).hex(), t

test.export(module)