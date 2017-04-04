require 'es6-shim'
vows = require 'vows'
assert = require 'assert'
chroma = require '../chroma'


vows
    .describe('Testing color temperature')

    .addBatch

        'generate colors by temperatures':
            topic: [4000,5000,10000,20000,30000,1000]
            '1k': (t) -> assert.equal chroma.kelvin(t[5]).hex(), '#ff3a00'
            '4k': (t) -> assert.equal chroma.kelvin(t[0]).hex(), '#ffd0a4'
            '5k': (t) -> assert.equal chroma.kelvin(t[1]).hex(), '#ffe4cd'
            '7k': (t) -> assert.equal chroma.kelvin(t[1]).hex(), '#ffe4cd'
            '10k': (t) -> assert.equal chroma.kelvin(t[2]).hex(), '#ccdcff'
            '20k': (t) -> assert.equal chroma.kelvin(t[3]).hex(), '#a8c5ff'
            '30k': (t) -> assert.equal chroma.kelvin(t[4]).hex(), '#9fbeff'

        'color --> temp':
            topic: ['#ff3a00', 'ffcfa3', 'cbdbff', '9ebeff']
            '1k': (t) -> assert.equal chroma(t[0]).kelvin(), 1000
            '4k': (t) -> assert.equal chroma(t[1]).kelvin(), 3989
            '10k': (t) -> assert.equal chroma(t[2]).kelvin(), 10115
            '30k': (t) -> assert.equal chroma(t[3]).kelvin(), 31100

    .export(module)