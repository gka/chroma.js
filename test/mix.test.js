import { describe, it, expect } from 'vitest';
import chroma from 'chroma-js';

describe('Some tests for chroma.color()', () => {
    it('hsv interpolation white <-> red', () => {
        const result = chroma('white').interpolate('red', 0.5, 'hsv');
        expect(result.hex()).toBe('#ff8080');
    });

    it('use mix as alias', () => {
        const result = chroma('white').mix('red', 0.5, 'hsv');
        expect(result.hex()).toBe('#ff8080');
    });

    it('alternative mix syntax', () => {
        const result = chroma.mix('red', 'blue', 0.25, 'rgb');
        expect(result.hex()).toBe('#bf0040');
    });

    it('hsl interpolation white <-> red', () => {
        const result = chroma('white').interpolate('red', 0.5, 'hsl');
        expect(result.hex()).toBe('#ff8080');
    });

    it('rgb interpolation white <-> red', () => {
        const result = chroma('white').interpolate('red', 0.5, 'rgb');
        expect(result.hex()).toBe('#ff8080');
    });

    it('hsv interpolation red <-> white', () => {
        const result = chroma('red').interpolate('white', 0.5, 'hsv');
        expect(result.hex()).toBe('#ff8080');
    });

    it('hsl interpolation red <-> white', () => {
        const result = chroma('red').interpolate('white', 0.5, 'hsl');
        expect(result.hex()).toBe('#ff8080');
    });

    it('rgb interpolation red <-> white', () => {
        const result = chroma('red').interpolate('white', 0.5, 'rgb');
        expect(result.hex()).toBe('#ff8080');
    });

    it('interpolation short function', () => {
        const interpolateFn = (t) => chroma.interpolate('#ff0000', '#ffffff', t, 'hsv').hex();

        expect(interpolateFn(0)).toBe('#ff0000');
        expect(interpolateFn(0.5)).toBe('#ff8080');
        expect(interpolateFn(1)).toBe('#ffffff');
    });

    it('num interpolation white <-> red', () => {
        const result = chroma(0xffffff).interpolate(0xff0000, 0.5, 'num');
        expect(result.hex()).toBe('#ff7fff');
    });

    it('num interpolation red <-> white', () => {
        const result = chroma(0xff0000).interpolate(0xffffff, 0.5, 'num');
        expect(result.hex()).toBe('#ff7fff');
    });

    it('interpolation short function with num provided', () => {
        const interpolateFn = (t) => chroma.interpolate(0xff0000, 0xffffff, t, 'num').hex();

        expect(interpolateFn(0)).toBe('#ff0000');
        expect(interpolateFn(0.5)).toBe('#ff7fff');
        expect(interpolateFn(1)).toBe('#ffffff');
    });

    it('interpolate in num', () => {
        const result = chroma.interpolate(chroma.num(0xffffe0), chroma.num(0x102180), 0.5, 'num');
        expect(result.hex()).toBe('#8810b0');
        expect(result.num()).toBe(8917168);
    });

    it('interpolate in hsv', () => {
        const result = chroma.interpolate('white', 'black', 0.5, 'hsv');
        expect(result.hex()).toBe('#808080');
    });

    it('interpolate in hsl', () => {
        const result = chroma.interpolate('lightyellow', 'navy', 0.5, 'hsl');
        expect(result.hex()).toBe('#31ff98');
    });

    it('interpolate in lrgb', () => {
        const result = chroma.interpolate('red', 'blue', 0.5, 'lrgb');
        expect(result.hex()).toBe('#b400b4');
    });

    it('mix gray and black', () => {
        const result = chroma.mix('#666666', '#000000', 0.5, 'lch');
        expect(result.hex()).toBe('#343434');
        expect(result.css()).toBe('rgb(52 52 52)');
    });

    it('hcl/lch interpolation reaches pure black exactly, even from a saturated color (#310)', () => {
        expect(chroma.interpolate('#f00', '#000', 1, 'hcl').hex()).toBe('#000000');
        expect(chroma.interpolate('#f00', '#000', 1, 'lch').hex()).toBe('#000000');
        expect(chroma.interpolate('#ccc', '#000', 1, 'hcl').hex()).toBe('#000000');
        // a target that is only *almost* black should still work as before
        expect(chroma.interpolate('#f00', '#010101', 1, 'hcl').hex()).toBe('#010101');
    });

    it('oklch interpolation reaches pure black exactly, even from a saturated color (#310)', () => {
        expect(chroma.interpolate('#f00', '#000', 1, 'oklch').hex()).toBe('#000000');
    });

    it('hcl shading toward black still stays vivid at intermediate steps', () => {
        // the fix for #310 only applies exactly at f === 1; intermediate
        // steps must keep behaving as before (shade()/tint() rely on this)
        expect(chroma('red').shade(0.5, 'lch').hex()).toBe('#a60000');
    });

    it('mix transparent gray and black', () => {
        const result = chroma.mix('#66666600', '#000000', 0.5, 'lch');
        expect(result.hex()).toBe('#34343480');
        expect(result.css()).toBe('rgb(52 52 52 / 0.5)');
    });
});
