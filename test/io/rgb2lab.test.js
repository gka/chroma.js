import { describe, it, expect } from 'vitest';
import rgb2lab from '../../src/io/lab/rgb2lab.js';
import chroma from 'chroma-js';

const round = (digits) => {
    const d = Math.pow(10, digits);
    return (v) => {
        if (v > -1e-3 && v < 1e-3) v = 0;
        return Math.round(v * d) / d;
    };
};
const rnd = round(2);

const tests = {
    black: { lab: [0, 0, 0], rgb: [0, 0, 0] },
    white: { lab: [100, 0, 0], rgb: [255, 255, 255] },
    gray: { lab: [53.59, 0, 0], rgb: [128, 128, 128] },
    red: { lab: [53.24, 80.09, 67.2], rgb: [255, 0, 0] },
    yellow: { lab: [97.14, -21.55, 94.48], rgb: [255, 255, 0] },
    green: { lab: [87.73, -86.18, 83.18], rgb: [0, 255, 0] },
    cyan: { lab: [91.11, -48.09, -14.13], rgb: [0, 255, 255] },
    blue: { lab: [32.3, 79.19, -107.86], rgb: [0, 0, 255] },
    magenta: { lab: [60.32, 98.23, -60.82], rgb: [255, 0, 255] }
};

describe('Test rgb2lab color conversions', () => {
    Object.keys(tests).forEach((key) => {
        const { lab, rgb } = tests[key];

        it(`rgb2lab ${key} converts array`, () => {
            expect(rgb2lab(rgb).map(rnd)).toEqual(lab);
        });

        it(`rgb2lab ${key} converts object`, () => {
            const [r, g, b] = rgb;
            expect(rgb2lab({ r, g, b }).map(rnd)).toEqual(lab);
        });

        it(`rgb2lab ${key} converts arguments`, () => {
            expect(rgb2lab(...rgb).map(rnd)).toEqual(lab);
        });
    });
});

describe('Test switching of Lab illuminant', () => {
    it('defaults to D65', () => {
        expect(chroma('yellow').lab().map(rnd)).toStrictEqual([
            97.14, -21.55, 94.48
        ]);
    });

    it('change to D50', () => {
        expect(chroma('yellow').lab().map(rnd)).toEqual([97.14, -21.55, 94.48]);
        chroma.setLabWhitePoint('d50');
        expect(chroma('yellow').lab().map(rnd)).toEqual([97.61, -15.75, 93.39]);
        // change back to not mess up other tests
        chroma.setLabWhitePoint('d65');
        expect(chroma('yellow').lab().map(rnd)).toEqual([97.14, -21.55, 94.48]);
    });
});
