import { describe, it, expect } from 'vitest';
import rgb2hcg from '../../src/io/hcg/rgb2hcg.js';
import hcg2rgb from '../../src/io/hcg/hcg2rgb.js';

// chroma value (C) and grayness (G) are defined on [0..1], which is what
// hcg2rgb consumes (see test/io/hcg2rgb.test.js). These cases are the exact
// inverse of that file's cases, so rgb2hcg and hcg2rgb agree.
const tests = {
    black: { hcg: [NaN, 0, 0], rgb: [0, 0, 0, 1] },
    white: { hcg: [NaN, 0, 1], rgb: [255, 255, 255, 1] },
    gray: { hcg: [NaN, 0, 0.5], rgb: [127.5, 127.5, 127.5, 1] },
    red: { hcg: [0, 1, 0], rgb: [255, 0, 0, 1] },
    yellow: { hcg: [60, 1, 0], rgb: [255, 255, 0, 1] },
    green: { hcg: [120, 1, 0], rgb: [0, 255, 0, 1] },
    cyan: { hcg: [180, 1, 0], rgb: [0, 255, 255, 1] },
    blue: { hcg: [240, 1, 0], rgb: [0, 0, 255, 1] },
    magenta: { hcg: [300, 1, 0], rgb: [255, 0, 255, 1] }
};

describe('Test rgb2hcg color conversions', () => {
    Object.keys(tests).forEach((key) => {
        const { hcg, rgb } = tests[key];

        it(`rgb2hcg ${key} converts array`, () => {
            expect(rgb2hcg(rgb)).toEqual(hcg);
        });

        it(`rgb2hcg ${key} converts object`, () => {
            const [r, g, b] = rgb;
            expect(rgb2hcg({ r, g, b })).toEqual(hcg);
        });

        it(`rgb2hcg ${key} converts arguments`, () => {
            expect(rgb2hcg(...rgb)).toEqual(hcg);
        });
    });

    // https://github.com/gka/chroma.js/issues/250 — rgb2hcg returned C/G on the
    // [0..100] scale (and a broken grayness), so rgb -> hcg -> rgb did not round
    // trip, especially when all three channels were non-zero.
    it('round-trips arbitrary RGB colors through HCG', () => {
        const colors = [
            [128, 64, 32],
            [100, 150, 200],
            [17, 99, 200],
            [250, 5, 5],
            [200, 200, 50],
            [10, 20, 30]
        ];
        colors.forEach((rgb) => {
            const [h, c, g] = rgb2hcg(rgb);
            const back = hcg2rgb([h, c, g]);
            rgb.forEach((channel, i) => {
                expect(back[i]).toBeCloseTo(channel, 6);
            });
        });
    });
});
