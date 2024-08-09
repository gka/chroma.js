import { describe, it, expect } from 'vitest';
import chroma from 'chroma-js';

describe('Tests for the alpha channel', () => {
    it('setting & getting alpha channel', () => {
        const color = chroma('red');
        expect(color.alpha()).toBe(1);
        expect(color.alpha(0.5).alpha()).toBe(0.5);
        expect(color.alpha()).toBe(1);
    });

    it('interpolating alpha channel', () => {
        const color = chroma.mix(chroma('white').alpha(0), chroma('black').alpha(1), 0.3, 'rgb');
        expect(color.hex('rgb')).toBe('#b3b3b3');
        expect(color.hex()).toBe('#b3b3b34d');
        expect(color.alpha()).toBe(0.3);
    });

    it('constructing rgba color', () => {
        const color = new chroma.Color(255, 0, 0, 0.5, 'rgb');
        expect(color.alpha()).toBe(0.5);
    });

    it('constructing rgba color, rgb shorthand', () => {
        const color = chroma.rgb(255, 0, 0, 0.5);
        expect(color.alpha()).toBe(0.5);
    });

    it('constructing rgba color, hsl shorthand', () => {
        const color = chroma.hsl(0, 1, 0.5).alpha(0.5);
        expect(color.name()).toBe('red');
        expect(color.alpha()).toBe(0.5);
    });

    it('parsing hex rgba colors', () => {
        const color = chroma('#ff00004d');
        expect(color.name()).toBe('red');
        expect(color.alpha()).toBe(0.3);
        expect(color.rgba()).toEqual([255, 0, 0, 0.3]);
    });

    it('parsing rgba colors', () => {
        const color = chroma.css('rgba(255,0,0,.3)');
        expect(color.name()).toBe('red');
        expect(color.alpha()).toBe(0.3);
        expect(color.rgba()).toEqual([255, 0, 0, 0.3]);
    });

    it('parsing rgba colors (percentage)', () => {
        const color = chroma.css('rgba(100%,0%,0%,0.2)');
        expect(color.name()).toBe('red');
        expect(color.alpha()).toBe(0.2);
        expect(color.rgb()).toEqual([255, 0, 0]);
        expect(color.rgba()).toEqual([255, 0, 0, 0.2]);
    });

    it('parsing hsla colors', () => {
        const color = chroma.css('hsla(0,100%,50%,0.25)');
        expect(color.name()).toBe('red');
        expect(color.alpha()).toBe(0.25);
        expect(color.rgb()).toEqual([255, 0, 0]);
        expect(color.rgba()).toEqual([255, 0, 0, 0.25]);
    });

    it('constructing hsla color', () => {
        const color = chroma(0, 1, 0.5, 0.25, 'hsl');
        expect(color.name()).toBe('red');
        expect(color.alpha()).toBe(0.25);
    });

    it('constructing hsva color', () => {
        const color = chroma(0, 1, 1, 0.25, 'hsv');
        expect(color.name()).toBe('red');
        expect(color.alpha()).toBe(0.25);
    });

    it('constructing hsia color', () => {
        const color = chroma(0, 1, 0.3333334, 0.25, 'hsi');
        expect(color.name()).toBe('red');
        expect(color.alpha()).toBe(0.25);
    });

    it('constructing laba color', () => {
        const color = chroma(53.24079414130722, 80.09245959641109, 67.20319651585301, 0.25, 'lab');
        expect(color.name()).toBe('red');
        expect(color.alpha()).toBe(0.25);
    });

    it('constructing lcha color', () => {
        const color = chroma(53.24079414130722, 104.55176567686985, 39.99901061253297, 0.25, 'lch');
        expect(color.name()).toBe('red');
        expect(color.alpha()).toBe(0.25);
    });

    it('constructing cmyka color', () => {
        const color = chroma(0, 1, 1, 0, 0.25, 'cmyk');
        expect(color.name()).toBe('red');
        expect(color.alpha()).toBe(0.25);
    });

    it('gl output', () => {
        const color = chroma.gl(1, 0, 0, 0.25);
        expect(color.name()).toBe('red');
        expect(color.alpha()).toBe(0.25);
        expect(color.gl()).toEqual([1, 0, 0, 0.25]);
    });

    it('rgba css output', () => {
        const color = chroma.css('hsla(0,100%,50%,0.25)');
        expect(color.css()).toBe('rgba(255 0 0 / 0.25)');
    });

    it('hex output', () => {
        const color = chroma.gl(1, 0, 0, 0.25);
        expect(color.hex()).toBe('#ff000040');
        expect(color.hex('rgb')).toBe('#ff0000');
        expect(color.hex('rgba')).toBe('#ff000040');
        expect(color.hex('argb')).toBe('#40ff0000');
    });

    it('num output', () => {
        const color = chroma.gl(1, 0, 0, 0.25);
        expect(color.num()).toBe(0xff0000);
    });

    it('setting alpha returns new instance', () => {
        const color = chroma('red');
        color.alpha(0.5);
        expect(color.alpha()).toBe(1);
    });
});
