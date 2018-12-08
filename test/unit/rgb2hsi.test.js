const vows = require('vows')
const assert = require('assert');
require('es6-shim');

const rgb2hsi = require('../../src/converter/out/rgb2hsi');

const tests = {
    black:      { in: [0,0,0],     out: [0,0,0]},
    white:      { in: [0,0,1],     out: [255,255,255]},
    gray:       { in: [0,0,0.5],   out: [127.5,127.5,127.5]},
    red:        { in: [0,1,0.5],   out: [255,0,0]},
    yellow:     { in: [60,1,0.5],  out: [255,255,0]},
    green:      { in: [120,1,0.5], out: [0,255,0]},
    cyan:       { in: [180,1,0.5], out: [0,255,255]},
    blue:       { in: [240,1,0.5], out: [0,0,255]},
    magenta:    { in: [300,1,0.5], out: [255,0,255]},
    red_again:  { in: [360,1,0.5], out: [255,0,0]}
};

const batch = {};

Object.keys(tests).forEach(key => {
    batch[`rgb2hsi ${key}`] = {
        topic: tests[key],
        array(topic) {
            assert.deepStrictEqual(rgb2hsi(topic.out), topic.in);
        },
        obj(topic) {
            let [r,g,b] = topic.out;
            assert.deepStrictEqual(rgb2hsi({r,g,b}), topic.in);
        },
        args(topic) {
            if (topic.mode != 'auto') return
            assert.deepStrictEqual(rgb2hsi.apply(null, topic.out), topic.in);
        }
    }
});

vows
    .describe('Test rgb2hsi color conversions')
    .addBatch(batch)
    .export(module);
