require('es6-shim');
const vows = require('vows');
const assert = require('assert');
const chroma = require('../index');


vows
    .describe('Testing bezier interpolation')

    .addBatch({

        'simple two color linear interpolation': {
            topic: {
                f: chroma.bezier(['white', chroma('black').alpha(0)])
            },
            'starts from white'(topic) { assert.equal(topic.f(0).hex(), '#ffffff'); },
            'ends in transparent black'(topic) { assert.equal(topic.f(1).hex(), '#00000000'); },
            'center is transluscent grey'(topic) { assert.equal(topic.f(0.5).hex(), '#77777780'); }
        },

        'three color quadratic bezier interpolation': {
            topic: {
                f: chroma.bezier(['white', chroma('red').alpha(.5), chroma('black').alpha(0)])
            },
            'starts from white'(topic) { assert.equal(topic.f(0).hex(), '#ffffff'); },
            'ends in transparent black'(topic) { assert.equal(topic.f(1).hex(), '#00000000'); },
            'center is a transluscent greyish red'(topic) { assert.equal(topic.f(0.5).hex(), '#c45c4480'); }
        },

        'four color cubic bezier interpolation': {
            topic: {
                f: chroma.bezier(['white', chroma('yellow').alpha(1/3), chroma('red').alpha(2/3), chroma('black').alpha(0)])
            },
            'starts from white'(topic) { assert.equal(topic.f(0).hex(), '#ffffff'); },
            'ends in transparent black'(topic) { assert.equal(topic.f(1).hex(), '#00000000'); },
            '1st quarter'(topic) { assert.equal(topic.f(0.25).hex(), '#ffe085a7'); },
            'center'(topic) { assert.equal(topic.f(0.5).hex(), '#e6973580'); },
            '3rd quarter'(topic) { assert.equal(topic.f(0.75).hex(), '#91421358'); }
        },

        'five color diverging quadratic bezier interpolation': {
            topic: {
                f: chroma.bezier(['darkred', chroma('orange').alpha(.75), chroma('snow').alpha(.5), chroma('lightgreen').alpha(.25), chroma('royalblue').alpha(0)])
            },
            'starts from darkred'(topic) { assert.equal(topic.f(0).hex(), '#8b0000'); },
            'ends in transparent royalblue'(topic) { assert.equal(topic.f(1).hex(), '#4169e100'); },
            'center is snow'(topic) { assert.equal(topic.f(0.5).hex(), '#fffafa80'); },
            '1st quarter'(topic) { assert.equal(topic.f(0.25).hex(), '#e9954ebf'); },
            '3rd quarter'(topic) { assert.equal(topic.f(0.75).hex(), '#a6cfc140'); }
        },

        'using bezier in a chroma.scale': {
            topic: {
                f: chroma.scale(
                    chroma.bezier(['darkred', 'orange', 'snow', 'lightgreen', 'royalblue'])
                ).domain([0,1],5).out('hex')
            },
            'starts from darkred'(topic) { assert.equal(topic.f(0), '#8b0000'); },
            'ends in royalblue'(topic) { assert.equal(topic.f(1), '#4169e1'); },
            'center is snow'(topic) { assert.equal(topic.f(0.5), '#fffafa'); },
            '1st quarter'(topic) { assert.equal(topic.f(0.25), '#e9954e'); },
            '3rd quarter'(topic) { assert.equal(topic.f(0.75), '#a6cfc1'); }
        }})
    .export(module);
