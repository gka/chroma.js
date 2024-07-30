import { describe, it, expect } from 'vitest';
import rgb2lch from '../src/io/lch/rgb2lch.js';

const round = (digits) => {
    const d = Math.pow(10, digits);
    return (v) => {
        if (v > -1e-3 && v < 1e-3) v = 0;
        return Math.round(v * d) / d;
    };
};
const rnd = round(2);

const tests = {
    black: { lch: [0, 0, NaN], rgb: [0, 0, 0] },
    white: { lch: [100, 0, NaN], rgb: [255, 255, 255] },
    gray: { lch: [53.59, 0, NaN], rgb: [128, 128, 128] },
    red: { lch: [53.24, 104.55, 40], rgb: [255, 0, 0] },
    yellow: { lch: [97.14, 96.91, 102.85], rgb: [255, 255, 0] },
    green: { lch: [87.73, 119.78, 136.02], rgb: [0, 255, 0] },
    cyan: { lch: [91.11, 50.12, 196.38], rgb: [0, 255, 255] },
    blue: { lch: [32.3, 133.81, 306.28], rgb: [0, 0, 255] },
    magenta: { lch: [60.32, 115.54, 328.23], rgb: [255, 0, 255] }
};

describe('Test rgb2lch color conversions', () => {
    Object.keys(tests).forEach((key) => {
        const { lch, rgb } = tests[key];

        it(`rgb2lch ${key} converts array`, () => {
            expect(rgb2lch(rgb).map(rnd)).toEqual(lch);
        });

        it(`rgb2lch ${key} converts object`, () => {
            const [r, g, b] = rgb;
            expect(rgb2lch({ r, g, b }).map(rnd)).toEqual(lch);
        });

        it(`rgb2lch ${key} converts arguments`, () => {
            expect(rgb2lch(...rgb).map(rnd)).toEqual(lch);
        });
    });
});
