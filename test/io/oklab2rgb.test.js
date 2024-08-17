import { describe, it, expect } from 'vitest';
import limit from '../../src/utils/limit.js';
import oklab2rgb from '../../src/io/oklab/oklab2rgb.js';

const round = (v) => limit(Math.round(v), 0, 255);

describe('Testing OKLab to RGB color conversions', () => {
    const testCases = {
        black: { in: [0.0, 0.0, 0.0], out: [0, 0, 0] },
        white: { in: [1.0, 0.0, 0.0], out: [255, 255, 255] },
        gray: { in: [0.59987, 0.0, 0.0], out: [128, 128, 128] },
        red: { in: [0.62796, 0.22486, 0.12585], out: [255, 0, 0] },
        yellow: { in: [0.96798, -0.07137, 0.19857], out: [255, 255, 0] },
        green: { in: [0.51975, -0.1403, 0.10768], out: [0, 128, 0] },
        cyan: { in: [0.9054, -0.14944, -0.0394], out: [0, 255, 255] },
        blue: { in: [0.45201, -0.03246, -0.31153], out: [0, 0, 255] },
        magenta: { in: [0.70167, 0.27457, -0.16916], out: [255, 0, 255] }
    };

    Object.keys(testCases).forEach((key) => {
        const { in: input, out: expected } = testCases[key];

        it(`should convert OKLab to RGB for ${key} with array input`, () => {
            const result = oklab2rgb(input).map(round);
            expect(result).toEqual(expected);
        });

        it(`should convert OKLab to RGB for ${key} with arguments`, () => {
            const result = oklab2rgb(...input).map(round);
            expect(result).toEqual(expected);
        });

        it(`should convert OKLab to RGB for ${key} with object input`, () => {
            const [l, a, b] = input;
            const result = oklab2rgb({ l, a, b }).map(round);
            expect(result).toEqual(expected);
        });
    });
});
