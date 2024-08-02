import { describe, it, expect } from 'vitest';
import hsv2rgb from '../../src/io/hsv/hsv2rgb.js';

describe('Testing HSV to RGB color conversions', () => {
    const testCases = [
        { hsv: [0, 0, 0], rgb: [0, 0, 0, 1] },
        { hsv: [0, 0, 1], rgb: [255, 255, 255, 1] },
        { hsv: [0, 1, 1], rgb: [255, 0, 0, 1] },
        { hsv: [120, 1, 1], rgb: [0, 255, 0, 1] },
        { hsv: [240, 1, 1], rgb: [0, 0, 255, 1] },
        { hsv: [60, 1, 1], rgb: [255, 255, 0, 1] },
        { hsv: [180, 1, 1], rgb: [0, 255, 255, 1] },
        { hsv: [300, 1, 1], rgb: [255, 0, 255, 1] }
    ];

    testCases.forEach(({ hsv, rgb }) => {
        it(`should convert hsv(${hsv}) to rgb(${rgb})`, () => {
            expect(hsv2rgb(hsv)).toEqual(rgb);
        });
    });

    testCases.forEach(({ hsv, rgb }) => {
        it(`should convert unpacked arguments hsv(${hsv}) to rgb(${rgb})`, () => {
            expect(hsv2rgb(...hsv)).toEqual(rgb);
        });
    });
});
