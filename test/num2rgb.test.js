import { describe, it, expect } from 'vitest';
import num2rgb from '../src/io/num/num2rgb.js';

describe('Testing num2rgb color conversions', () => {
    const testCases = {
        black: { in: 0x000000, out: [0, 0, 0, 1] },
        white: { in: 0xffffff, out: [255, 255, 255, 1] },
        red: { in: 0xff0000, out: [255, 0, 0, 1] },
        green: { in: 0x00ff00, out: [0, 255, 0, 1] },
        blue: { in: 0x0000ff, out: [0, 0, 255, 1] },
        yellow: { in: 0xffff00, out: [255, 255, 0, 1] },
        cyan: { in: 0x00ffff, out: [0, 255, 255, 1] },
        magenta: { in: 0xff00ff, out: [255, 0, 255, 1] }
    };

    Object.keys(testCases).forEach((key) => {
        const { in: input, out: expected } = testCases[key];

        it(`should convert numeric HEX to RGB for ${key}`, () => {
            const result = num2rgb(input);
            expect(result).toEqual(expected);
        });
    });
});
