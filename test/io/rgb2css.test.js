import { describe, it, expect } from 'vitest';
import rgb2css from '../../src/io/css/rgb2css.js';

const tests = {
    black: { rgb: [0, 0, 0], css: 'rgb(0 0 0)' },
    red: { rgb: [255, 0, 0], css: 'rgb(255 0 0)' },
    auto_rgba: { rgb: [255, 0, 0, 0.25], css: 'rgb(255 0 0 / 0.25)' },
    force_rgba: { rgb: [255, 0, 0], mode: 'rgba', css: 'rgb(255 0 0 / 1)' },
    hsl: { rgb: [255, 0, 0], mode: 'hsl', css: 'hsl(0deg 100% 50%)' },
    auto_hsla: {
        rgb: [255, 0, 0, 0.5],
        mode: 'hsl',
        css: 'hsl(0deg 100% 50% / 0.5)'
    },
    force_hsla: {
        rgb: [255, 255, 0, 0.75],
        mode: 'hsl',
        css: 'hsl(60deg 100% 50% / 0.75)'
    },
    lab: { rgb: [255, 0, 0], mode: 'lab', css: 'lab(54.29% 80.81 69.89)' },
    laba: {
        rgb: [255, 0, 0, 0.5],
        mode: 'lab',
        css: 'lab(54.29% 80.81 69.89 / 0.5)'
    },
    lch: { rgb: [255, 0, 0], mode: 'lch', css: 'lch(54.29% 106.84 40.85deg)' },
    lcha: {
        rgb: [255, 0, 0, 0.25],
        mode: 'lch',
        css: 'lch(54.29% 106.84 40.85deg / 0.25)'
    },
    oklab: {
        rgb: [212, 248, 128],
        mode: 'oklab',
        css: 'oklab(92.83% -0.08 0.13)'
    },
    oklaba: {
        rgb: [212, 248, 128, 0.4],
        mode: 'oklab',
        css: 'oklab(92.83% -0.08 0.13 / 0.4)'
    },
    oklch: {
        rgb: [212, 248, 128],
        mode: 'oklch',
        css: 'oklch(92.83% 0.15 123.13deg)'
    },
    oklcha: {
        rgb: [212, 248, 128, 0.6],
        mode: 'oklch',
        css: 'oklch(92.83% 0.15 123.13deg / 0.6)'
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
