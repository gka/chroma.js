const vows = require('vows');
const assert = require('assert');
require('es6-shim');

import limit from '../src/utils/limit.js';
import oklch2rgb from '../src/io/oklch/oklch2rgb.js';

const round = (v) => limit(Math.round(v), 0, 255);

vows.describe('Testing LCH conversions')
    .addBatch({
        'oklch to rgb': {
            topic: {
                black: { in: [0.0, 0.0, NaN], out: [0, 0, 0, 1] },
                white: { in: [1.0, 0.0, NaN], out: [255, 255, 255, 1] },
                gray: { in: [0.59987, 0.0, NaN], out: [128, 128, 128, 1] },
                red: {
                    in: [0.62796, 0.25768, 29.233885192342633],
                    out: [255, 0, 0, 1]
                },
                yellow: {
                    in: [0.96798, 0.21101, 109.76923207652125],
                    out: [255, 255, 0, 1]
                },
                green: {
                    in: [0.51975, 0.17686, 142.49533888780996],
                    out: [0, 128, 0, 1]
                },
                cyan: {
                    in: [0.9054, 0.15455, 194.76894793196382],
                    out: [0, 255, 255, 1]
                },
                blue: {
                    in: [0.45201, 0.31321, 264.052020638055],
                    out: [0, 0, 255, 1]
                },
                magenta: {
                    in: [0.70167, 0.32249, 328.36341792345144],
                    out: [255, 0, 255, 1]
                }
            },
            lch_arr(topic) {
                Object.keys(topic).forEach((key) => {
                    assert.deepEqual(
                        oklch2rgb(topic[key].in).map(round),
                        topic[key].out
                    );
                });
            },
            lch_args(topic) {
                Object.keys(topic).forEach((key) => {
                    assert.deepEqual(
                        oklch2rgb.apply(null, topic[key].in).map(round),
                        topic[key].out,
                        key
                    );
                });
            },
            lch_obj(topic) {
                Object.keys(topic).forEach((key) => {
                    const [l, c, h] = topic[key].in;
                    assert.deepEqual(
                        oklch2rgb({ l, c, h }).map(round),
                        topic[key].out,
                        key
                    );
                });
            }
        }
    })
    .export(module);
