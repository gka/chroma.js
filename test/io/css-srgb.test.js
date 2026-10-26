import { describe, it, expect } from 'vitest';
import chroma from 'chroma-js';

const css2rgb = chroma.input.format.css;

describe('CSS color(srgb) input', () => {
    const testCases = {
        'color(srgb 0 0 0 / 0.5)': [0, 0, 0, 0.5],
        'color(srgb 1 0.5 .25)': [255, 127.5, 63.75, 1],
        'color(srgb 100% 50% 25% / 25%)': [255, 127.5, 63.75, 0.25],
        'color(srgb .5 25% 1 / 0)': [127.5, 63.75, 255, 0],
        'color(srgb none none none)': [0, 0, 0, 1],
        'color(srgb none 50% .25 / none)': [0, 127.5, 63.75, 0],
        'color(srgb +.5 5e-1 5E+1% / 5e-1)': [127.5, 127.5, 127.5, 0.5],
        'color(srgb 1.0 0.0 0.0/50%)': [255, 0, 0, 0.5],
        ' COLOR(SRGB 1 0 0 / .5) ': [255, 0, 0, 0.5],
        'color( srgb\t1\n0 .5 / .25 )': [255, 0, 127.5, 0.25],
        'color(srgb 0.639216 0.419608 1 / 0.298)': [
            163.00008, 107.00004, 255, 0.298
        ]
    };

    Object.keys(testCases).forEach((text) => {
        it(`parses ${text}`, () => {
            const expected = testCases[text];
            expect(css2rgb(text)).toEqual(expected);
            expect(css2rgb.test(text)).toBe(true);
            expect(chroma.valid(text)).toBe(true);
            expect(chroma(text).rgba(false)).toEqual(expected);
            expect(chroma.css(text).rgba(false)).toEqual(expected);
        });
    });

    it('preserves fractional channels until rounded output is requested', () => {
        const color = chroma('color(srgb .5 .25 .125 / .75)');
        expect(color.rgba(false)).toEqual([127.5, 63.75, 31.875, 0.75]);
        expect(color.rgb()).toEqual([128, 64, 32]);
        expect(color.clipped()).toBe(false);
    });

    it('uses the existing RGB clipping and alpha limits', () => {
        const color = chroma('color(srgb 1.2 -10% .5 / 150%)');
        expect(color.rgba(false)).toEqual([255, 0, 127.5, 1]);
        expect(color.clipped()).toBe(true);
        expect(color._rgb._unclipped).toEqual([306, -25.5, 127.5, 1.5]);
        expect(chroma('color(srgb 0 0 0 / -.5)').alpha()).toBe(0);
        expect(css2rgb('color(srgb 0 0 0 / 2)')).toEqual([0, 0, 0, 2]);
    });

    it('clips numeric exponents beyond the floating-point range', () => {
        expect(
            chroma('color(srgb 1e400 -1e400 1e400% / 1e400)').rgba(false)
        ).toEqual([255, 0, 255, 1]);
    });

    const invalid = [
        'color(srgb 0 0)',
        'color(srgb 0 0 0 0)',
        'color(srgb 0, 0, 0)',
        'color(srgb 0 0 0 /)',
        'color(srgb 0 0 0 / .5 / .5)',
        'color(srgb 0 0 0 / 1px)',
        'color(srgb 0 0 0 / nan)',
        'color(srgb 0 0 1e)',
        'color(srgb 0 0 0.)',
        'color(srgb 0 0 5.e1)',
        'color(srgb 0 0 1e+)',
        'color(srgb 0 0 0x10)',
        'color(srgb 0 0 infinity)',
        'color(srgb 0 0 1%%)',
        'color (srgb 0 0 0)',
        'color(srgb .1.2.3)',
        'color(srgb calc(1) 0 0)',
        'color(from red srgb r g b)',
        'color(srgb 0 0 0)junk',
        'color(srgb-linear 0 0 0)',
        'color(display-p3 0 0 0)',
        'color(xyz 0 0 0)'
    ];

    invalid.forEach((text) => {
        it(`rejects ${text}`, () => {
            expect(css2rgb(text)).toBeUndefined();
            expect(css2rgb.test(text)).toBe(false);
            expect(chroma.valid(text)).toBe(false);
            expect(() => chroma(text)).toThrow();
        });
    });
});
