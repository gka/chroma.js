import { describe, it, expect } from 'vitest';
import lab2lch from '../../src/io/lch/lab2lch.js';

const testCases = [
    { name: 'black', lab: [0, 0, 0], lch: [0, 0, NaN] },
    { name: 'white', lab: [100, 0, 0], lch: [100, 0, NaN] },
    { name: 'gray', lab: [53.59, 0, 0], lch: [53.59, 0, NaN] },
    { name: 'red', lab: [53.24, 80.09, 67.2], lch: [53.24, 104.55, 40] },
    {
        name: 'yellow',
        lab: [97.14, -21.55, 94.48],
        lch: [97.14, 96.91, 102.85]
    },
    {
        name: 'green',
        lab: [87.73, -86.18, 83.18],
        lch: [87.73, 119.77, 136.01]
    },
    { name: 'cyan', lab: [91.11, -48.09, -14.13], lch: [91.11, 50.12, 196.37] },
    { name: 'blue', lab: [32.3, 79.19, -107.86], lch: [32.3, 133.81, 306.29] },
    {
        name: 'magenta',
        lab: [60.32, 98.23, -60.82],
        lch: [60.32, 115.53, 328.24]
    }
];

const round = (digits) => {
    const d = Math.pow(10, digits);
    return (v) => Math.round(v * d) / d;
};

const rnd = round(2);

describe('Testing lab2lch color conversions', () => {
    testCases.forEach(({ name, lab, lch }) => {
        it(`${name}: should convert ${lab} to ${lch}`, () => {
            expect(lab2lch(lab).map(rnd)).toEqual(lch);
        });
    });

    testCases.forEach(({ name, lab, lch }) => {
        it(`${name}: should convert unpacked arguments ${lab} to ${lch}`, () => {
            expect(lab2lch(...lab).map(rnd)).toEqual(lch);
        });
    });

    testCases.forEach(({ name, lab, lch }) => {
        it(`${name}: should convert object ${lab} to ${lch}`, () => {
            const [l, a, b] = lab;
            expect(lab2lch({ l, a, b }).map(rnd)).toEqual(lch);
        });
    });
});
