import { describe, it, expect } from 'vitest';
import rgb2hsi from '../../src/io/hsi/rgb2hsi.js';

const tests = {
    black2: { hsi: [NaN, 0, 0], rgb: [0, 0, 0, 1] },
    white: { hsi: [NaN, 0, 1], rgb: [255, 255, 255, 1] },
    gray: { hsi: [NaN, 0, 0.5], rgb: [127.5, 127.5, 127.5, 1] },
    red: { hsi: [0, 1, 1 / 3], rgb: [255, 0, 0, 1] },
    yellow: { hsi: [60, 1, 2 / 3], rgb: [255, 255, 0, 1] },
    green: { hsi: [120, 1, 1 / 3], rgb: [0, 255, 0, 1] },
    cyan: { hsi: [180, 1, 2 / 3], rgb: [0, 255, 255, 1] },
    blue: { hsi: [240, 1, 1 / 3], rgb: [0, 0, 255, 1] },
    magenta: { hsi: [300, 1, 2 / 3], rgb: [255, 0, 255, 1] }
};

const round = (digits) => {
    const d = Math.pow(10, digits);
    return (v) => Math.round(v * d) / d;
};
const rnd = round(5);

describe('Test rgb2hsi color conversions', () => {
    Object.keys(tests).forEach((key) => {
        const { hsi, rgb } = tests[key];

        it(`rgb2hsi ${key} converts array`, () => {
            expect(rgb2hsi(rgb).map(rnd)).toEqual(hsi.map(rnd));
        });

        it(`rgb2hsi ${key} converts object`, () => {
            const [r, g, b] = rgb;
            expect(rgb2hsi({ r, g, b }).map(rnd)).toEqual(hsi.map(rnd));
        });

        it(`rgb2hsi ${key} converts arguments`, () => {
            // Assuming `mode` is always 'auto' based on original code
            expect(rgb2hsi(...rgb).map(rnd)).toEqual(hsi.map(rnd));
        });
    });
});
