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
            'at 0.25': (t) -> assert.equal t(0.25).hex(), '#15524b'
            'at 0.5': (t) -> assert.equal t(0.5).hex(), '#a07949'
            'at 0.75': (t) -> assert.equal t(0.75).hex(), '#c6b2ec'
            'ends in white': (t) -> assert.equal t(1).hex(), '#ffffff'

        'red helix':
            topic: () -> chroma.cubehelix(0, 1, 1, 1)
            'starts in black': (t) -> assert.equal t(0).hex(), '#000000'
            'at 0.25': (t) -> assert.equal t(0.25).hex(), '#2d5016'
            'at 0.5': (t) -> assert.equal t(0.5).hex(), '#4b939e'
            'at 0.75': (t) -> assert.equal t(0.75).hex(), '#d1aee8'
            'ends in white': (t) -> assert.equal t(1).hex(), '#ffffff'

        'red helix - partial l range':
            topic: () -> chroma.cubehelix(0, 1, 1, 1, [0.25, 0.75])
            'starts in black': (t) -> assert.equal t(0).hex(), '#663028'
            'at 0.25': (t) -> assert.equal t(0.25).hex(), '#48742c'
            'at 0.5': (t) -> assert.equal t(0.5).hex(), '#4b939e'
            'at 0.75': (t) -> assert.equal t(0.75).hex(), '#b68ad2'
            'ends in white': (t) -> assert.equal t(1).hex(), '#e5afa7'

        'red helix - gamma':
            topic: () -> chroma.cubehelix(0, 1, 1, 0.8)
            'starts in black': (t) -> assert.equal t(0).hex(), '#000000'
            'at 0.25': (t) -> assert.equal t(0.25).hex(), '#3e6823'
            'at 0.5': (t) -> assert.equal t(0.5).hex(), '#60a6b1'
            'at 0.75': (t) -> assert.equal t(0.75).hex(), '#dabbee'
            'ends in white': (t) -> assert.equal t(1).hex(), '#ffffff'

        'red helix - no saturation':
            topic: () -> chroma.cubehelix(0, 1, 0, 1)
            'starts in black': (t) -> assert.equal t(0).hex(), '#000000'
            'at 0.25': (t) -> assert.equal t(0.25).hex(), '#3f3f3f'
            'at 0.5': (t) -> assert.equal t(0.5).hex(), '#7f7f7f'
            'at 0.75': (t) -> assert.equal t(0.75).hex(), '#bfbfbf'
            'ends in white': (t) -> assert.equal t(1).hex(), '#ffffff'

        'red helix - saturation range':
            topic: () -> chroma.cubehelix(0, 1, [1,0], 1)
            'starts in black': (t) -> assert.equal t(0).hex(), '#000000'
            'at 0.25': (t) -> assert.equal t(0.25).hex(), '#324c21'
            'at 0.5': (t) -> assert.equal t(0.5).hex(), '#65898f'
            'at 0.75': (t) -> assert.equal t(0.75).hex(), '#c3bbc9'
            'ends in white': (t) -> assert.equal t(1).hex(), '#ffffff'
            'saturation decreases': (t) -> assert t(0.33).hsl()[1] > t(0.66).hsl()[1]

    .export(module)