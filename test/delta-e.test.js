const vows = require('vows')
const assert = require('assert');
require('es6-shim');

const deltaE = require('../src/utils/delta-e');

// due to floating-point arithmetic on different devices, differences in decimals may be found.
// Running http://www.brucelindbloom.com/index.html?ColorDifferenceCalc.html JS code locally
// on the same device as the delta-e code in this library will provide the exact same results.
const tests = {
    nodifference: {in: [0x000000, 0x000000],   out: 0},
    maxdifference: {in: [0xFFFFFF, 0x000000],   out: 100},
    redgreen: {in: [0xff0000, 0x00ff00],     out: 86.6082374535373},
    greenred: {in: [0x00ff00, 0xff0000],     out: 86.6082374535373},
    beef: {in: [0x00beef, 0xbeef00],   out: 56.75641476716213},
    similar: {in: [0xededee, 0xedeeed],    out: 1.3211081906645834},
    similarish: {in: [0xececee, 0xeceeec],  out: 2.601879624602976},
    lesssimilar: {in: [0xe9e9ee, 0xe9eee9],    out: 6.220878841368716},
    lesssimilarish: {in: [0xe4e4ee, 0xe4eee4],    out: 11.598175546813964},
    notverysimilar: {in: [0xe0e0ee, 0xe0eee0],    out: 15.391371803506503},
};

const batch = {};

Object.keys(tests).forEach(key => {
    batch[`delta-e ${key}`] = {
        topic: tests[key],
        num(topic) {
            // checks if result is within 1% of "out" value.
            // This is done because results may be slightly
            // off depending on device setup due to floating
            // point arithmetic. If "out" is 0, and result was 0,
            // avoid divide by zero and set to true.
            let result = deltaE(topic.in[0], topic.in[1]);
            let percent = Math.abs(result-topic.out)/topic.out;
            assert.deepEqual((topic.out == 0 && result == 0) || percent < 0.1, true);
        }
    }
})

vows
    .describe('Testing delta-e color delta (dE00)')
    .addBatch(batch)
    .export(module);
