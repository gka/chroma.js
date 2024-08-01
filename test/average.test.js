import { describe, it, expect } from 'vitest';
import chroma from '../dist/index.mjs';

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
});
