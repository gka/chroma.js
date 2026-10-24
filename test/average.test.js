import { describe, it, expect } from 'vitest';
import chroma from 'chroma-js';

const average = chroma.average;

const colors = ['red', 'blue', 'white'];

describe('Tests for average color', () => {
    it('average in RGB', () => {
        const result = average(colors, 'rgb');
        expect(result.hex()).toBe('#aa55aa');
    });

    it('average with alpha channel', () => {
        const result = average([chroma('red').alpha(0.5), chroma('blue').alpha(0.5)], 'rgb');
        expect(result.rgba()).toEqual([128, 0, 128, 0.5]);
    });

    it('average in lab', () => {
        const result = average(colors, 'lab');
        expect(result.hex()).toBe('#e26daf');
    });

    it('average h in lch', () => {
        const result = average([chroma.lch(50, 50, 0), chroma.lch(50, 50, 90)], 'lch').get('lch.h');
        expect(Math.round(result)).toBe(45);
    });

    it('average in hsl of same colors', () => {
        const result = average(['#02c03a', '#02c03a'], 'hsl');
        expect(result.hex()).toBe('#02c03a');
    });

    it('average same color', () => {
        const result = average(['#02c03a', '#02c03a'], 'hsl');
        expect(result.hex()).toBe('#02c03a');
    });

    it('lrgb average', () => {
        const result = average(colors, 'lrgb');
        expect(result.hex()).toBe('#d093d0');
    });

    it('three colors, weighted rgb average', () => {
        const result = average(colors, 'rgb', [1, 1, 2]);
        expect(result.hex()).toBe('#bf80bf');
    });

    it('three colors, weighted lrgb average', () => {
        const result = average(colors, 'lrgb', [1, 3, 2]);
        expect(result.hex()).toBe('#b493e9');
    });

    it('three colors, weighted hsl average', () => {
        const result = average(colors, 'hsl', [0.25, 1, 0.5]);
        expect(result.hex()).toBe('#8163e5');
    });

    // see https://github.com/gka/chroma.js/issues/252
    // the weighted circular mean of hues must be independent of color order:
    // averaging the same colors with the same weights, listed in a different
    // order, must yield the same hue. Previously the first color's hue was
    // weighted twice (its angle was scaled by the weight before cos/sin),
    // breaking this property whenever weights[0] !== 1 and the first hue !== 0.
    it('weighted hue average is order-independent', () => {
        const a = average(['cyan', 'red'], 'hsl', [1, 4]).get('hsl.h');
        const b = average(['red', 'cyan'], 'hsl', [4, 1]).get('hsl.h');
        expect(a).toBeCloseTo(b, 6);
        // red (hue 0) carries 4x the weight of cyan (hue 180), so the
        // resultant hue must sit at 0, not be pulled away by cyan.
        expect(a).toBeCloseTo(0, 4);
    });

    it('weighted lch hue average matches circular mean', () => {
        const h1 = average(['#ff0000', '#00ff00'], 'lch', [3, 1]).get('lch.h');
        const h2 = average(['#00ff00', '#ff0000'], 'lch', [1, 3]).get('lch.h');
        expect(h1).toBeCloseTo(h2, 6);
        expect(h1).toBeCloseTo(51.6798, 3);
    });
});
