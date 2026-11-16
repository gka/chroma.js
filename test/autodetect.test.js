import { describe, it, expect } from 'vitest';
import chroma from 'chroma-js';

describe('autodetect color', () => {
    it('autodetect named color', () => {
        const result = chroma('red');
        expect(result.hex()).toBe('#ff0000');
        expect(result.rgb()).toStrictEqual([255, 0, 0]);
    });

    it('autodetect hex color', () => {
        const result = chroma('#00ff00');
        expect(result.name()).toBe('lime');
    });

    it('autodetect hex color, no #', () => {
        const result = chroma('00ff00');
        expect(result.name()).toBe('lime');
    });

    it('autodetect 3-digit hex color, no #', () => {
        const result = chroma('0F0');
        expect(result.name()).toBe('lime');
        expect(result.alpha()).toBe(1);
    });

    it('autodetect 4-digit hex color', () => {
        const result = chroma('#0F09');
        expect(result.name()).toBe('lime');
        expect(result.alpha()).toBe(0.6);
    });

    it('autodetect RGB color', () => {
        const result = chroma(0, 0, 255);
        expect(result.hex()).toBe('#0000ff');
    });

    it('rejects non-numeric RGB channels', () => {
        expect(() => chroma('nonsense', 0, 255, 'rgb')).toThrow('invalid rgb color');
        expect(() => chroma(null, 0, 255, 'rgb')).toThrow('invalid rgb color');
    });

    it('still clips out-of-range numeric RGB channels', () => {
        expect(chroma(-1000, 0, 255, 'rgb').hex()).toBe('#0000ff');
        expect(chroma(1000, 0, 255, 'rgb').hex()).toBe('#ff00ff');
    });

    it('autodetect rgba color', () => {
        const result = chroma(255, 0, 0, 0.5);
        expect(result.css()).toBe('rgb(255 0 0 / 0.5)');
    });

    it('autodetect legacy hsl color', () => {
        const result = chroma('hsl(120, 100%, 50%)');
        expect(result.name()).toBe('lime');
    });

    it('autodetect modern hsl color', () => {
        const result = chroma('hsl(120deg 100% 50%)');
        expect(result.name()).toBe('lime');
    });

    describe('autodetect css colors regardless of case and surrounding whitespace', () => {
        const testCases = {
            'RGB(0, 255, 0)': [0, 255, 0, 1],
            'Rgba(0 255 0 / 50%)': [0, 255, 0, 0.5],
            'HSL(120, 100%, 50%)': [0, 255, 0, 1],
            'LAB(50 0 0)': [119, 119, 119, 1],
            'OKLCH(0.5 0 0)': [99, 99, 99, 1],
            ' rgb(0, 255, 0)\n': [0, 255, 0, 1],
            TRANSPARENT: [0, 0, 0, 0]
        };

        Object.keys(testCases).forEach((css) => {
            it(`autodetect ${JSON.stringify(css)}`, () => {
                expect(chroma.valid(css)).toBe(true);
                expect(chroma(css).rgba()).toStrictEqual(testCases[css]);
            });
        });
    });
});
