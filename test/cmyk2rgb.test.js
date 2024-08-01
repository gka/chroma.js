import { describe, it, expect } from 'vitest';
import cmyk2rgb from '../src/io/cmyk/cmyk2rgb.js';

const cmykColors = [
    [0, 0, 0, 1],
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [1, 0, 1, 0],
    [1, 1, 0, 0],
    [0, 0, 1, 0],
    [1, 0, 0, 0],
    [0, 1, 0, 0]
];
const rgbColors = [
    [0, 0, 0, 1],
    [255, 255, 255, 1],
    [255, 0, 0, 1],
    [0, 255, 0, 1],
    [0, 0, 255, 1],
    [255, 255, 0, 1],
    [0, 255, 255, 1],
    [255, 0, 255, 1]
];

describe('Testing CMYK color conversions', () => {
    describe('parse simple CMYK colors', () => {
        it('black', () => {
            expect(cmyk2rgb(cmykColors[0])).toEqual(rgbColors[0]);
        });

        it('white', () => {
            expect(cmyk2rgb(cmykColors[1])).toEqual(rgbColors[1]);
        });

        it('red', () => {
            expect(cmyk2rgb(cmykColors[2])).toEqual(rgbColors[2]);
        });

        it('green', () => {
            expect(cmyk2rgb(cmykColors[3])).toEqual(rgbColors[3]);
        });

        it('blue', () => {
            expect(cmyk2rgb(cmykColors[4])).toEqual(rgbColors[4]);
        });

        it('yellow', () => {
            expect(cmyk2rgb(cmykColors[5])).toEqual(rgbColors[5]);
        });

        it('cyan', () => {
            expect(cmyk2rgb(cmykColors[6])).toEqual(rgbColors[6]);
        });

        it('magenta', () => {
            expect(cmyk2rgb(cmykColors[7])).toEqual(rgbColors[7]);
        });
    });

    describe('test unpacked arguments', () => {
        it('black', () => {
            expect(cmyk2rgb(...cmykColors[0])).toEqual(rgbColors[0]);
        });

        it('white', () => {
            expect(cmyk2rgb(...cmykColors[1])).toEqual(rgbColors[1]);
        });

        it('red', () => {
            expect(cmyk2rgb(...cmykColors[2])).toEqual(rgbColors[2]);
        });

        it('green', () => {
            expect(cmyk2rgb(...cmykColors[3])).toEqual(rgbColors[3]);
        });

        it('blue', () => {
            expect(cmyk2rgb(...cmykColors[4])).toEqual(rgbColors[4]);
        });

        it('yellow', () => {
            expect(cmyk2rgb(...cmykColors[5])).toEqual(rgbColors[5]);
        });

        it('cyan', () => {
            expect(cmyk2rgb(...cmykColors[6])).toEqual(rgbColors[6]);
        });

        it('magenta', () => {
            expect(cmyk2rgb(...cmykColors[7])).toEqual(rgbColors[7]);
        });
    });
});
