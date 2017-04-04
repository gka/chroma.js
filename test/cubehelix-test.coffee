require 'es6-shim'
vows = require 'vows'
assert = require 'assert'
chroma = require '../chroma'


vows
    .describe('Testing cubehelix scales')

    .addBatch

        'default helix':
            topic: () -> chroma.cubehelix()
            'starts in black': (t) -> assert.equal t(0).hex(), '#000000'
            'at 0.25': (t) -> assert.equal t(0.25).hex(), '#16534c'
            'at 0.5': (t) -> assert.equal t(0.5).hex(), '#a07949'
            'at 0.75': (t) -> assert.equal t(0.75).hex(), '#c7b3ed'
            'ends in white': (t) -> assert.equal t(1).hex(), '#ffffff'

        'red helix':
            topic: () -> chroma.cubehelix(0, 1, 1, 1)
            'starts in black': (t) -> assert.equal t(0).hex(), '#000000'
            'at 0.25': (t) -> assert.equal t(0.25).hex(), '#2e5117'
            'at 0.5': (t) -> assert.equal t(0.5).hex(), '#4c949f'
            'at 0.75': (t) -> assert.equal t(0.75).hex(), '#d1aee8'
            'ends in white': (t) -> assert.equal t(1).hex(), '#ffffff'

        'red helix - partial l range':
            topic: () -> chroma.cubehelix(0, 1, 1, 1, [0.25, 0.75])
            'starts': (t) -> assert.equal t(0).hex(), '#663028'
            'at 0.25': (t) -> assert.equal t(0.25).hex(), '#49752d'
            'at 0.5': (t) -> assert.equal t(0.5).hex(), '#4c949f'
            'at 0.75': (t) -> assert.equal t(0.75).hex(), '#b68ad2'
            'ends': (t) -> assert.equal t(1).hex(), '#e6b0a8'

        'red helix - gamma':
            topic: () -> chroma.cubehelix(0, 1, 1, 0.8, [0,1])
            'starts in black': (t) -> assert.equal t(0).hex(), '#000000'
            'at 0.25': (t) -> assert.equal t(0.25).hex(), '#3f6824'
            'at 0.5': (t) -> assert.equal t(0.5).hex(), '#60a6b1'
            'at 0.75': (t) -> assert.equal t(0.75).hex(), '#dabcee'
            'ends in white': (t) -> assert.equal t(1).hex(), '#ffffff'

        'red helix - no saturation':
            topic: () -> chroma.cubehelix(0, 1, 0, 1, [0,1])
            'starts in black': (t) -> assert.equal t(0).hex(), '#000000'
            'at 0.25': (t) -> assert.equal t(0.25).hex(), '#404040'
            'at 0.5': (t) -> assert.equal t(0.5).hex(), '#808080'
            'at 0.75': (t) -> assert.equal t(0.75).hex(), '#bfbfbf'
            'ends in white': (t) -> assert.equal t(1).hex(), '#ffffff'

        'red helix - saturation range':
            topic: () -> chroma.cubehelix(0, 1, [1,0], 1, [0,1])
            'starts in black': (t) -> assert.equal t(0).hex(), '#000000'
            'at 0.25': (t) -> assert.equal t(0.25).hex(), '#324c21'
            'at 0.5': (t) -> assert.equal t(0.5).hex(), '#668a8f'
            'at 0.75': (t) -> assert.equal t(0.75).hex(), '#c4bbc9'
            'ends in white': (t) -> assert.equal t(1).hex(), '#ffffff'
            'saturation decreases': (t) -> assert t(0.33).hsl()[1] > t(0.66).hsl()[1]

        'non-array lightness':
            topic: () -> chroma.cubehelix(300, -1.5, 1, 1, 0.5)
            'start': (t) -> assert.equal t(0).hex(), '#ae629f'
            'at 0.5': (t) -> assert.equal t(0.5).hex(), '#a07949'
            'end': (t) -> assert.equal t(1).hex(), '#519d60'


    .export(module)