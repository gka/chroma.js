import { describe, it, expect } from 'vitest';
import hsl2rgb from '../src/io/hsl/hsl2rgb.js';

describe('Testing HSL to RGB color conversions', () => {
    const testCases = [
        { name: 'black', hsl: [0, 0, 0], rgb: [0, 0, 0, 1] },
        { name: 'white', hsl: [0, 0, 1], rgb: [255, 255, 255, 1] },
        { name: 'gray', hsl: [0, 0, 0.5], rgb: [127.5, 127.5, 127.5, 1] },
        { name: 'red', hsl: [0, 1, 0.5], rgb: [255, 0, 0, 1] },
        { name: 'yellow', hsl: [60, 1, 0.5], rgb: [254.99999999999994, 255, 0, 1] },
        { name: 'green', hsl: [120, 1, 0.5], rgb: [0, 255, 0, 1] },
        { name: 'cyan', hsl: [180, 1, 0.5], rgb: [0, 254.99999999999994, 255, 1] },
        { name: 'blue', hsl: [240, 1, 0.5], rgb: [0, 0, 255, 1] },
        { name: 'magenta', hsl: [300, 1, 0.5], rgb: [255, 0, 254.99999999999994, 1] },
        { name: 'red again', hsl: [360, 1, 0.5], rgb: [255, 0, 0, 1] }
    ];

    testCases.forEach(({ name, hsl, rgb }) => {
        describe(name, () => {
            it(`convert hsl2rgb([${hsl}]) to rgb(${rgb})`, () => {
                expect(hsl2rgb(hsl)).toEqual(rgb);
            });
            it(`convert hsl2rgb(${hsl}) to rgb(${rgb})`, () => {
                expect(hsl2rgb(...hsl)).toEqual(rgb);
            });
        });
    });
});
