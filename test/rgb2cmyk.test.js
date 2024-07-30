import { describe, it, expect } from 'vitest';
import rgb2cmyk from '../src/io/cmyk/rgb2cmyk.js';

const tests = {
    black: { cmyk: [0, 0, 0, 1], rgb: [0, 0, 0, 1] },
    white: { cmyk: [0, 0, 0, 0], rgb: [255, 255, 255, 1] },
    red: { cmyk: [0, 1, 1, 0], rgb: [255, 0, 0, 1] },
    green: { cmyk: [1, 0, 1, 0], rgb: [0, 255, 0, 1] },
    blue: { cmyk: [1, 1, 0, 0], rgb: [0, 0, 255, 1] },
    yellow: { cmyk: [0, 0, 1, 0], rgb: [255, 255, 0, 1] },
    cyan: { cmyk: [1, 0, 0, 0], rgb: [0, 255, 255, 1] },
    magenta: { cmyk: [0, 1, 0, 0], rgb: [255, 0, 255, 1] }
};

describe('Testing CMYK color conversions', () => {
    Object.keys(tests).forEach((key) => {
        const { cmyk, rgb } = tests[key];

        it(`rgb2cmyk ${key} converts RGB to CMYK`, () => {
            expect(rgb2cmyk(rgb)).toEqual(cmyk);
        });
    });
});
