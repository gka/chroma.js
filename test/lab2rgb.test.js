import { describe, it, expect } from 'vitest';
import lab2rgb from '../src/io/lab/lab2rgb.js';
import limit from '../src/utils/limit.js';

const round = (v) => limit(Math.round(v), +0, 255);

describe('Testing LAB to RGB color conversions', () => {
    const testCases = [
        { name: 'black', lab: [0, 0, 0], rgb: [0, 0, 0, 1] },
        { name: 'white', lab: [100, 0, 0], rgb: [255, 255, 255, 1] },
        { name: 'gray', lab: [53.59, 0, 0], rgb: [128, 128, 128, 1] },
        { name: 'red', lab: [53.24, 80.09, 67.2], rgb: [255, 0, 0, 1] },
        { name: 'yellow', lab: [97.14, -21.55, 94.48], rgb: [255, 255, 0, 1] },
        { name: 'green', lab: [87.73, -86.18, 83.18], rgb: [0, 255, 0, 1] },
        { name: 'cyan', lab: [91.11, -48.09, -14.13], rgb: [0, 255, 255, 1] },
        { name: 'blue', lab: [32.3, 79.19, -107.86], rgb: [0, 0, 255, 1] },
        { name: 'magenta', lab: [60.32, 98.23, -60.82], rgb: [255, 0, 255, 1] }
    ];

    testCases.forEach(({ name, lab, rgb }) => {
        it(`${name}: should convert ${lab} to ${rgb}`, () => {
            expect(lab2rgb(lab).map(round)).toStrictEqual(rgb);
        });
    });

    testCases.forEach(({ name, lab, rgb }) => {
        it(`${name}: should convert unpacked arguments ${lab} to ${rgb}`, () => {
            expect(lab2rgb(...lab).map(round)).toStrictEqual(rgb);
        });
    });
});
