import { describe, it, expect } from 'vitest';
import limit from '../../src/utils/limit.js';
import lch2rgb from '../../src/io/lch/lch2rgb.js';

const testCases = [
    { name: 'black', in: [0, 0, NaN], out: [0, 0, 0, 1] },
    { name: 'white', in: [100, 0, NaN], out: [255, 255, 255, 1] },
    { name: 'gray', in: [53.59, 0, NaN], out: [128, 128, 128, 1] },
    { name: 'red', in: [53.24, 104.55, 40], out: [255, 0, 0, 1] },
    { name: 'yellow', in: [97.14, 96.91, 102.85], out: [255, 255, 0, 1] },
    { name: 'green', in: [87.73, 119.78, 136.02], out: [0, 255, 0, 1] },
    { name: 'cyan', in: [91.11, 50.12, 196.38], out: [0, 255, 255, 1] },
    { name: 'blue', in: [32.3, 133.81, 306.28], out: [0, 0, 255, 1] },
    { name: 'magenta', in: [60.32, 115.54, 328.23], out: [255, 0, 255, 1] }
];

const round = (v) => limit(Math.round(v), 0, 255);

describe('Testing LCH to RGB color conversions', () => {
    testCases.forEach(({ name, in: lchIn, out: rgbOut }) => {
        it(`${name}: should convert ${lchIn} to ${rgbOut}`, () => {
            expect(lch2rgb(lchIn).map(round)).toEqual(rgbOut);
        });
    });

    testCases.forEach(({ name, in: lchIn, out: rgbOut }) => {
        it(`${name}: should convert unpacked arguments ${lchIn} to ${rgbOut}`, () => {
            expect(lch2rgb(...lchIn).map(round)).toEqual(rgbOut);
        });
    });

    testCases.forEach(({ name, in: lchIn, out: rgbOut }) => {
        it(`${name}: should convert object ${lchIn} to ${rgbOut}`, () => {
            const [l, c, h] = lchIn;
            expect(lch2rgb({ l, c, h }).map(round)).toEqual(rgbOut);
        });
    });
});
