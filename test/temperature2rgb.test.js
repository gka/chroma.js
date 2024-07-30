import { describe, it, expect } from 'vitest';
import temperature2rgb from '../src/io/temp/temperature2rgb.js';

const { round } = Math;

describe('Testing Kelvin color conversions', () => {
    const cases = {
        '1k': { in: 1000, out: [255, 58, 0, 1] },
        '4k': { in: 4000, out: [255, 208, 164, 1] },
        '5k': { in: 5000, out: [255, 228, 205, 1] },
        '7k': { in: 7000, out: [245, 243, 255, 1] },
        '10k': { in: 10000, out: [204, 220, 255, 1] },
        '20k': { in: 20000, out: [168, 197, 255, 1] },
        '30k': { in: 30000, out: [159, 190, 255, 1] }
    };

    Object.keys(cases).forEach((key) => {
        it(`parse simple kelvin colors for ${key}`, () => {
            expect(temperature2rgb(cases[key].in).map(round)).toEqual(cases[key].out);
        });
    });
});
