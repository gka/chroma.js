import { describe, it, expect } from 'vitest';
import hsi2rgb from '../../src/io/hsi/hsi2rgb.js';

const round = (digits) => {
    const d = Math.pow(10, digits);
    return (v) => Math.round(v * d) / d;
};

const testCases = [
    { name: 'black', hsi: [0, 0, 0], rgb: [0, 0, 0, 1] },
    { name: 'black2', hsi: [NaN, 0, 0], rgb: [0, 0, 0, 1] },
    { name: 'white', hsi: [0, 0, 1], rgb: [255, 255, 255, 1] },
    { name: 'gray', hsi: [0, 0, 0.5], rgb: [127.5, 127.5, 127.5, 1] },
    { name: 'red', hsi: [0, 1, 1 / 3], rgb: [255, 0, 0, 1] },
    { name: 'yellow', hsi: [60, 1, 2 / 3], rgb: [255, 255, 0, 1] },
    { name: 'green', hsi: [120, 1, 1 / 3], rgb: [0, 255, 0, 1] },
    { name: 'cyan', hsi: [180, 1, 2 / 3], rgb: [0, 255, 255, 1] },
    { name: 'blue', hsi: [240, 1, 1 / 3], rgb: [0, 0, 255, 1] },
    { name: 'magenta', hsi: [300, 1, 2 / 3], rgb: [255, 0, 255, 1] },
    { name: 'red_again', hsi: [360, 1, 1 / 3], rgb: [255, 0, 0, 1] }
];

describe('Testing HSI to RGB color conversions', () => {
    testCases.forEach(({ name, hsi, rgb }) => {
        it(`${name}: should convert ${hsi} to ${rgb}`, () => {
            expect(hsi2rgb(hsi).map(round(4))).toEqual(rgb);
        });
    });

    testCases.forEach(({ name, hsi, rgb }) => {
        it(`${name}: should convert unpacked arguments ${hsi} to ${rgb}`, () => {
            expect(hsi2rgb(...hsi).map(round(4))).toEqual(rgb);
        });
    });

    testCases.forEach(({ name, hsi, rgb }) => {
        it(`${name}: should convert object ${hsi} to ${rgb}`, () => {
            const [h, s, i] = hsi;
            expect(hsi2rgb({ h, s, i }).map(round(4))).toEqual(rgb);
        });
    });
});
