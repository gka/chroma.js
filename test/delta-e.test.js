const vows = require('vows')
const assert = require('assert');
require('es6-shim');

const deltaE = require('../src/utils/delta-e');

vows
    .describe('Testing delta-e color delta (dE00)')
    .addBatch({
        'retrieve delta-e value between two colors': {
            topic: {
                nodifference: {in: [0x000000, 0x000000],   out: [0,0,0,1]},
                maxdifference: {in: [0xFFFFFF, 0x000000],   out: [255,255,255,1]},
                redgreen: {in: [0xff0000, 0x00ff00],     out: [255,0,0,1]},
                greenred: {in: [0x00ff00, 0xff0000],     out: [255,0,0,1]},
                beef: {in: [0x00beef, 0xbeef00],   out: [0,255,0,1]},
                similar: {in: [0xededee, 0xedeeed],    out: [0,0,255,1]},
                similarish: {in: [0xececee, 0xeceeec],  out: [255,255,0,1]},
                lesssimilar: {in: [0xe9e9ee, 0xe9eee9],    out: [0,255,255,1]},
                lesssimilarish: {in: [0xe4e4ee, 0xe4eee4],    out: [0,255,255,1]},
                notverysimilar: {in: [0xe0e0ee, 0xe0eee0],    out: [0,255,255,1]},
            },
            num(topic) {
                Object.keys(topic).forEach(key => {
                    assert.deepEqual(deltaE(topic[key].in[0], topic[key].in[1]), 5);
                });
            }
        }
    })
    .export(module);
