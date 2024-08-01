import { describe, it, expect } from 'vitest';
import chroma from '../dist/index.mjs';

describe('Manipulating colors', () => {
    it('darken', () => {
        const red = chroma('red');
        expect(red.darken().hex()).toEqual('#c20000');
        expect(red.darker().hex()).toEqual('#c20000');
    });

    it('darken more', () => {
        const red = chroma('red');
        expect(red.darken(2).hex()).toEqual('#890000');
        expect(red.darken(10).hex()).toEqual('#000000');
    });

    it('brighten', () => {
        const red = chroma('red');
        expect(red.brighten().hex()).toEqual('#ff5a36');
        expect(red.brighter().hex()).toEqual('#ff5a36');
    });

    it('brighten more', () => {
        const red = chroma('red');
        expect(red.brighten(2).hex()).toEqual('#ff9264');
        expect(red.brighter(10).hex()).toEqual('#ffffff');
    });

    it('saturate', () => {
        const red = chroma('red');
        expect(red.saturate().hex()).toEqual('#ff0000');
    });

    it('desaturate', () => {
        const red = chroma('red');
        expect(red.desaturate().hex()).toEqual('#ee3a20');
    });

    it('desaturate more', () => {
        const red = chroma('red');
        expect(red.desaturate(2).hex()).toEqual('#db5136');
    });

    it('desaturate too much', () => {
        const red = chroma('red');
        expect(red.desaturate(400).hex()).toEqual('#7f7f7f');
    });

    it('shade a color', () => {
        const red = chroma('red');
        expect(red.shade().hex()).toEqual('#b40000');
        expect(red.shade(0.25).hex()).toEqual('#dd0000');
        expect(red.shade(0.75).hex()).toEqual('#800000');
    });

    it('shade a color in different spaces', () => {
        const red = chroma('red');
        expect(red.shade(0.5).hex()).toEqual('#b40000'); // default lrgb
        expect(red.shade(0.5, 'rgb').hex()).toEqual('#800000');
        expect(red.shade(0.5, 'lch').hex()).toEqual('#a60000');
        expect(red.shade(0.5, 'lab').hex()).toEqual('#7a1b0c');
    });

    it('tint a color', () => {
        const red = chroma('red');
        expect(red.tint().hex()).toEqual('#ffb4b4');
        expect(red.tint(0.25).hex()).toEqual('#ff8080');
        expect(red.tint(0.75).hex()).toEqual('#ffdddd');
    });

    it('tint a color in different spaces', () => {
        const red = chroma('red');
        expect(red.tint(0.5).hex()).toEqual('#ffb4b4'); // default lrgb
        expect(red.tint(0.5, 'rgb').hex()).toEqual('#ff8080');
        expect(red.tint(0.5, 'lch').hex()).toEqual('#ff9e81');
        expect(red.tint(0.5, 'lab').hex()).toEqual('#ff9e81');
    });
});
