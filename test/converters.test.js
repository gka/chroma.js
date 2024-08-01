import { describe, it, expect } from 'vitest';
import chroma from '../dist/index.js';

describe('Testing color conversions', () => {
    for (const colorName in chroma.colors) {
        const hexValue = chroma.colors[colorName];

        it(`should convert ${colorName} to hsl and back`, () => {
            expect(chroma.hsl(chroma(hexValue).hsl()).hex()).toBe(hexValue);
        });

        it(`should convert ${colorName} to cmyk and back`, () => {
            expect(chroma.cmyk(chroma(hexValue).cmyk()).hex()).toBe(hexValue);
        });

        it(`should convert ${colorName} to css and back`, () => {
            expect(chroma.css(chroma(hexValue).css()).hex()).toBe(hexValue);
        });

        it(`should convert ${colorName} to hsi and back`, () => {
            expect(chroma.hsi(chroma(hexValue).hsi()).hex()).toBe(hexValue);
        });

        it(`should convert ${colorName} to hsv and back`, () => {
            expect(chroma.hsv(chroma(hexValue).hsv()).hex()).toBe(hexValue);
        });

        it(`should convert ${colorName} to lab and back`, () => {
            expect(chroma.lab(chroma(hexValue).lab()).hex()).toBe(hexValue);
        });

        it(`should convert ${colorName} to oklab and back`, () => {
            expect(chroma.oklab(chroma(hexValue).oklab()).hex()).toBe(hexValue);
        });

        it(`should convert ${colorName} to lch and back`, () => {
            expect(chroma.lch(chroma(hexValue).lch()).hex()).toBe(hexValue);
        });

        it(`should convert ${colorName} to oklch and back`, () => {
            expect(chroma.oklch(chroma(hexValue).oklch()).hex()).toBe(hexValue);
        });

        it(`should convert ${colorName} to num and back`, () => {
            expect(chroma.num(chroma(hexValue).num()).hex()).toBe(hexValue);
        });
    }
});
