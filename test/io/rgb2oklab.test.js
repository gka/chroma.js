import { describe, it, expect, afterEach } from 'vitest';
import rgb2oklab from '../../src/io/oklab/rgb2oklab.js';
import chroma from 'chroma-js';

const round = (digits) => {
    const d = Math.pow(10, digits);
    return (v) => {
        if (v > -1e-3 && v < 1e-3) v = 0;
        return Math.round(v * d) / d;
    };
};
const rnd = round(3);

describe('Testing OKLab color conversions', () => {
    const colors = {
        black: { out: [0.0, 0.0, 0.0], in: [0, 0, 0, 1] },
        white: { out: [1.0, 0.0, 0.0], in: [255, 255, 255, 1] },
        gray: { out: [0.6, 0.0, 0.0], in: [128, 128, 128, 1] },
        red: { out: [0.628, 0.225, 0.126], in: [255, 0, 0, 1] },
        yellow: { out: [0.968, -0.071, 0.199], in: [255, 255, 0, 1] },
        green: { out: [0.52, -0.14, 0.108], in: [0, 128, 0, 1] },
        cyan: { out: [0.905, -0.149, -0.039], in: [0, 255, 255, 1] },
        blue: { out: [0.452, -0.032, -0.312], in: [0, 0, 255, 1] },
        magenta: { out: [0.702, 0.275, -0.169], in: [255, 0, 255, 1] }
    };

    Object.keys(colors).forEach((key) => {
        const { out, in: rgb } = colors[key];

        it(`rgb2oklab ${key} converts array`, () => {
            expect(rgb2oklab(rgb).map(rnd)).toEqual(out);
        });

        it(`rgb2oklab ${key} converts arguments`, () => {
            expect(rgb2oklab(...rgb).map(rnd)).toEqual(out);
        });

        it(`rgb2oklab ${key} converts object`, () => {
            const [r, g, b] = rgb;
            expect(rgb2oklab({ r, g, b }).map(rnd)).toEqual(out);
        });
    });
});

describe('OKLab ignores the Lab white point', () => {
    afterEach(() => {
        chroma.setLabWhitePoint('d65');
    });

    ['d65', 'd50'].forEach((whitePoint) => {
        it(`converts to oklab and oklch with ${whitePoint}`, () => {
            chroma.setLabWhitePoint(whitePoint);
            const oklab = chroma('#7654cd').oklab();
            expect(oklab[0]).toBeCloseTo(0.5443, 3);
            expect(oklab[1]).toBeCloseTo(0.0682, 3);
            expect(oklab[2]).toBeCloseTo(-0.1656, 3);
            const oklch = chroma('#7654cd').oklch();
            expect(oklch[0]).toBeCloseTo(0.5443, 3);
            expect(oklch[1]).toBeCloseTo(0.1791, 3);
            expect(oklch[2]).toBeCloseTo(292.38, 1);
        });

        it(`converts from oklab and oklch with ${whitePoint}`, () => {
            chroma.setLabWhitePoint(whitePoint);
            expect(chroma.oklab(0.5443, 0.0682, -0.1656).hex()).toBe('#7654cd');
            expect(chroma.oklch(0.5443, 0.1791, 292.38).hex()).toBe('#7654cd');
        });
    });
});
