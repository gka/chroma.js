import { describe, it, expect } from 'vitest';
import hcg2rgb from '../src/io/hcg/hcg2rgb.js';

describe('Testing HCG color conversions', () => {
    const colors = {
        black: { in: [0, 0, 0], out: [0, 0, 0, 1] },
        white: { in: [0, 0, 1], out: [255, 255, 255, 1] },
        gray: { in: [0, 0, 0.5], out: [127.5, 127.5, 127.5, 1] },
        red: { in: [0, 1, 0], out: [255, 0, 0, 1] },
        yellow: { in: [60, 1, 0], out: [255, 255, 0, 1] },
        green: { in: [120, 1, 0], out: [0, 255, 0, 1] },
        cyan: { in: [180, 1, 0], out: [0, 255, 255, 1] },
        blue: { in: [240, 1, 0], out: [0, 0, 255, 1] },
        magenta: { in: [300, 1, 0], out: [255, 0, 255, 1] },
        red_again: { in: [360, 1, 0], out: [255, 0, 0, 1] }
    };

    it('parse simple HCG colors (array)', () => {
        Object.keys(colors).forEach((key) => {
            expect(hcg2rgb(colors[key].in)).toEqual(colors[key].out);
        });
    });

    it('parse simple HCG colors (arguments)', () => {
        Object.keys(colors).forEach((key) => {
            expect(hcg2rgb(...colors[key].in)).toEqual(colors[key].out);
        });
    });

    it('parse simple HCG colors (object)', () => {
        Object.keys(colors).forEach((key) => {
            const [h, c, g] = colors[key].in;
            expect(hcg2rgb({ h, c, g })).toEqual(colors[key].out);
        });
    });
});
