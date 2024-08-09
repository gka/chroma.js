import { describe, it, expect } from 'vitest';
import rgb2css from '../../src/io/css/rgb2css.js';

const tests = {
    black: { rgb: [0, 0, 0], css: 'rgb(0,0,0)' },
    red: { rgb: [255, 0, 0], css: 'rgb(255,0,0)' },
    auto_rgba: { rgb: [255, 0, 0, 0.25], css: 'rgba(255,0,0,0.25)' },
    force_rgba: { rgb: [255, 0, 0], mode: 'rgba', css: 'rgba(255,0,0,1)' },
    hsl: { rgb: [255, 0, 0], mode: 'hsl', css: 'hsl(0,100%,50%)' },
    auto_hsla: {
        rgb: [255, 0, 0, 0.5],
        mode: 'hsl',
        css: 'hsla(0,100%,50%,0.5)'
    },
    force_hsla: {
        rgb: [255, 255, 0, 0.75],
        mode: 'hsl',
        css: 'hsla(60,100%,50%,0.75)'
    }
};

describe('Testing rgb2css color conversions', () => {
    Object.keys(tests).forEach((key) => {
        const { rgb, mode, css } = tests[key];

        it(`rgb2css ${key} converts array`, () => {
            expect(rgb2css(rgb, mode || 'rgb')).toBe(css);
        });

        it(`rgb2css ${key} converts object`, () => {
            const [r, g, b, a] = rgb;
            const obj = {
                r,
                g,
                b,
                ...(a !== undefined ? { a } : {})
            };
            expect(rgb2css(obj, mode)).toBe(css);
        });

        it(`rgb2css ${key} converts arguments`, () => {
            if (mode !== 'rgb') return;
            expect(rgb2css(...rgb)).toBe(css);
        });
    });
});
