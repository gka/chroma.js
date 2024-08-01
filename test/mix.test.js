import { describe, it, expect } from 'vitest';
import chroma from '../dist/index.mjs';

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
});
