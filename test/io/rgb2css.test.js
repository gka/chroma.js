import { describe, it, expect } from 'vitest';
import rgb2css from '../../src/io/css/rgb2css.js';
import css2rgb from '../../src/io/css/css2rgb.js';
import chroma from '../../index.js';

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
        css: 'oklab(92.83% -0.083 0.127)'
    },
    oklaba: {
        rgb: [212, 248, 128, 0.4],
        mode: 'oklab',
        css: 'oklab(92.83% -0.083 0.127 / 0.4)'
    },
    oklch: {
        rgb: [212, 248, 128],
        mode: 'oklch',
        css: 'oklch(92.83% 0.152 123.12deg)'
    },
    oklcha: {
        rgb: [212, 248, 128, 0.6],
        mode: 'oklch',
        css: 'oklch(92.83% 0.152 123.12deg / 0.6)'
    },
    white_rgb: { rgb: [255, 255, 255], css: 'rgb(255 255 255)' },
    white_lab: { rgb: [255, 255, 255], mode: 'lab', css: 'lab(100% 0 0)' },
    white_lch: { rgb: [255, 255, 255], mode: 'lch', css: 'lch(100% 0 none)' },
    gray_lch: { rgb: [120, 120, 120], mode: 'lch', css: 'lch(50.43% 0 none)' },
    black_lch: { rgb: [0, 0, 0], mode: 'lch', css: 'lch(0% 0 none)' },
    white_oklab: {
        rgb: [255, 255, 255],
        mode: 'oklab',
        css: 'oklab(100% 0 0)'
    },
    white_oklch: {
        rgb: [255, 255, 255],
        mode: 'oklch',
        css: 'oklch(100% 0 none)'
    },
    gray_oklch: {
        rgb: [120, 120, 120],
        mode: 'oklch',
        css: 'oklch(57.27% 0 none)'
    },
    black_oklch: { rgb: [0, 0, 0], mode: 'oklch', css: 'oklch(0% 0 none)' }
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

describe('oklab and oklch css strings parse back to a matching color', () => {
    ['#d4090e', '#0cadad', '#5b544c'].forEach((hex) => {
        ['oklab', 'oklch'].forEach((mode) => {
            it(`${hex} in ${mode}`, () => {
                const parsed = chroma(
                    css2rgb(rgb2css(chroma(hex).rgb(), mode))
                );
                expect(chroma.deltaE(parsed, hex)).toBeLessThan(1);
            });
        });
    });
});
