const vows = require('vows')
const assert = require('assert');
require('es6-shim');

const rgb2hex = require('../../src/converter/out/rgb2hex');

const tests = {
    black:      { rgb: [0,0,0,1],       mode: 'auto',   hex: '#000000' },
    white:      { rgb: [255,255,255,1], mode: 'auto',   hex: '#ffffff' },
    gray:       { rgb: [128,128,128,1], mode: 'auto',   hex: '#808080' },
    red:        { rgb: [255,0,0,1],     mode: 'auto',   hex: '#ff0000' },
    yellow:     { rgb: [0,255,0,1],     mode: 'auto',   hex: '#00ff00' },
    green:      { rgb: [0,0,255,1],     mode: 'auto',   hex: '#0000ff' },
    cyan:       { rgb: [255,255,0,1],   mode: 'auto',   hex: '#ffff00' },
    blue:       { rgb: [0,255,255,1],   mode: 'auto',   hex: '#00ffff' },
    magenta:    { rgb: [255,0,255,1],   mode: 'auto',   hex: '#ff00ff' },
};

const batch = {};

Object.keys(tests).forEach(key => {
    batch[`rgb2hex ${key}`] = {
        topic: tests[key],
        array(topic) {
            assert.deepStrictEqual(rgb2hex(topic.rgb), topic.hex);
        },
        // args(topic) {
        //     assert.deepStrictEqual(rgb2hex.apply(null, topic.rgb), topic.hex);
        // },
        // obj(topic) {
        //     let [r,g,b] = topic.rgb;
        //     assert.deepStrictEqual(rgb2hex({r,g,b}), topic.hex);
        // }
    }
});

vows
    .describe('Test rgb2hex color conversions')
    .addBatch(batch)
    .export(module);
