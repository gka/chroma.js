import { describe, it, expect } from 'vitest';
import chroma from '../index.js';

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
});
