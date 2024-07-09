const vows = require('vows');
const assert = require('assert');
require('es6-shim');

import limit from '../src/utils/limit.js';
import rgb2oklab from '../src/io/oklab/rgb2oklab.js';

const round = digits => {
    const d = Math.pow(10, digits);
    return v => {
        if (v > -1e-3 && v < 1e-3) v = 0;
        return Math.round(v * d) / d;
    };
};
const rnd = round(3);

vows.describe('Testing OKLab color conversions')
    .addBatch({
        'rgb2oklab: parse simple OKLab colors': {
            topic: {
                black: { out: [0.0, 0.0, 0.0], in: [0, 0, 0, 1] },
                white: { out: [1.0, 0.0, 0.0], in: [255, 255, 255, 1] },
                gray: { out: [0.6, 0.0, 0.0], in: [128, 128, 128, 1] },
                red: { out: [0.628, 0.225, 0.126], in: [255, 0, 0, 1] },
                yellow: { out: [0.968, -0.071, 0.199], in: [255, 255, 0, 1] },
                green: { out: [0.52, -0.14, 0.108], in: [0, 128, 0, 1] },
                cyan: { out: [0.905, -0.149, -0.039], in: [0, 255, 255, 1] },
                blue: { out: [0.452, -0.032, -0.312], in: [0, 0, 255, 1] },
                magenta: { out: [0.702, 0.275, -0.169], in: [255, 0, 255, 1] }
            },
            lab_arr(topic) {
                Object.keys(topic).forEach(key => {
                    assert.deepEqual(rgb2oklab(topic[key].in).map(rnd), topic[key].out);
                });
            },
            lab_args(topic) {
                Object.keys(topic).forEach(key => {
                    assert.deepEqual(
                        rgb2oklab.apply(null, topic[key].in).map(rnd),
                        topic[key].out,
                        key
                    );
                });
            },
            lab_obj(topic) {
                Object.keys(topic).forEach(key => {
                    const [r, g, b] = topic[key].in;
                    assert.deepEqual(rgb2oklab({ r, g, b }).map(rnd), topic[key].out, key);
                });
            }
        }
    })
    .export(module);
