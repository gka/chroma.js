import { describe, it, expect } from 'vitest';
import chroma from '../index.js';

describe('Some tests for chroma.lch()', () => {
    describe('lch grayscale', () => {
        const grays = [
            { l: 0, hex: '#000000' },
            { l: 25, hex: '#3b3b3b' },
            { l: 50, hex: '#777777' },
            { l: 75, hex: '#b9b9b9' },
            { l: 100, hex: '#ffffff' }
        ];

        for (const { l, hex } of grays) {
            it(`l = ${l}`, () => {
                expect(chroma.lch(l, 0, 0).hex()).toEqual(hex);
            });
        }
    });

    describe('lch hues', () => {
        const hues = [
            { h: 0, hex: '#dc2c7a' },
            { h: 60, hex: '#bd5c00' },
            { h: 120, hex: '#548400' },
            { h: 180, hex: '#009175' },
            { h: 240, hex: '#008cde' },
            { h: 300, hex: '#6f67df' },
            { h: 360, hex: '#dc2c7a' }
        ];

        for (const { h, hex } of hues) {
            it(`h = ${h}`, () => {
                expect(chroma.lch(50, 70, h).hex()).toEqual(hex);
            });
        }
    });

    describe('lch clipping', () => {
        it('20 not clipped', () => {
            expect(chroma.lch(90, 20, 80).clipped()).toEqual(false);
        });

        it('40 clipped', () => {
            expect(chroma.lch(90, 40, 80).clipped()).toEqual(true);
        });

        it('60 clipped', () => {
            expect(chroma.lch(90, 60, 80).clipped()).toEqual(true);
        });

        it('80 clipped', () => {
            expect(chroma.lch(90, 80, 80).clipped()).toEqual(true);
        });

        it('100 clipped', () => {
            expect(chroma.lch(90, 100, 80).clipped()).toEqual(true);
        });
    });
});
