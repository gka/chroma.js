const vows = require('vows')
const assert = require('assert');
require('es6-shim');

const hsl2rgb = require('../../src/converter/in/hsl2rgb');

// const round = (digits) => {
//     const d = Math.pow(10,digits);
//     return (v) => Math.round(v*d) / d;
// }

vows
    .describe('Testing CMYK color conversions')
    .addBatch({
        'parse simple HSL colors': {
            topic: [[0,0,0],[0,0,1],[0,0,0.5],[0,1,0.5],[60,1,0.5,0.5],[120,1,0.5],[180,1,0.5],[240,1,0.5],[300,1,0.5],[360,1,0.5]],
            black(t)    { return assert.deepEqual(hsl2rgb(t[0]), [0,0,0]); },
            white(t)    { return assert.deepEqual(hsl2rgb(t[1]), [255,255,255]); },
            gray(t)     { return assert.deepEqual(hsl2rgb(t[2]), [127.5,127.5,127.5]); },
            red(t)      { return assert.deepEqual(hsl2rgb(t[3]), [255,0,0]); },
            yellow(t)   { return assert.deepEqual(hsl2rgb(t[4]), [255,255,0,0.5]); },
            green(t)    { return assert.deepEqual(hsl2rgb(t[5]), [0,255,0]); },
            cyan(t)     { return assert.deepEqual(hsl2rgb(t[6]), [0,255,255]); },
            blue(t)     { return assert.deepEqual(hsl2rgb(t[7]), [0,0,255]); },
            magenta(t)  { return assert.deepEqual(hsl2rgb(t[8]), [255,0,255]); },
            red_again(t)  { return assert.deepEqual(hsl2rgb(t[9]), [255,0,0]); }
        }
    })
    .export(module);
