import { describe, it, expect } from 'vitest';
import contrastAPCA from '../src/utils/contrastAPCA.js';
import chroma from 'chroma-js';

const contrast = chroma.contrast;

describe('Testing contrast ratio', () => {
    it('maximum contrast is 21:1', () => {
        expect(contrast('black', 'white')).toBe(21);
    });

    it('minimum contrast is 1:1', () => {
        expect(contrast('white', 'white')).toBe(1);
    });

    it('contrast between white and red is 4:1', () => {
        expect(contrast('white', 'red').toFixed(1)).toBe('4.0');
    });

    it('contrast between black and red is 5.25:1', () => {
        expect(contrast('black', 'red').toFixed(2)).toBe('5.25');
    });

    it('contrast between black and darkgrey is 1.32:1', () => {
        expect(contrast('black', '#222').toFixed(2)).toBe('1.32');
    });
});

describe('Testing contrast ratio with APCA', () => {
    it('maximum contrast', () => {
        expect(+contrastAPCA('black', 'white').toFixed(1)).toBe(106);
        expect(+contrastAPCA('white', 'black').toFixed(1)).toBe(-107.9);
    });

    it('minimum contrast', () => {
        expect(+contrastAPCA('gray', 'gray').toFixed(1)).toBe(0);
    });

    it('contrast without alpha', () => {
        expect(+contrastAPCA('#594d45', '#ffd4d4').toFixed(1)).toBe(69.0);
        expect(+contrastAPCA('#b04646', '#d6d6d6').toFixed(1)).toBe(52.9);
        expect(+contrastAPCA('#c2afaf', '#d6d6d6').toFixed(1)).toBe(17.0);
    });

    it('contrast with alpha', () => {
        // todo: there's a slight difference to the values shown in the APCA demo
        // when computing contrast between colors with alpha
        expect(+contrastAPCA('#00000044', 'white').toFixed(1)).toBe(37.3); // 36.7
        expect(+contrastAPCA('#ffffffc0', 'black').toFixed(1)).toBe(-68); // -68.6
    });

    it('inverse contrast', () => {
        expect(+contrastAPCA('#f5f5b3', '#614f63').toFixed(1)).toBe(-81.7);
        expect(+contrastAPCA('#67a7d6', '#4f6357').toFixed(1)).toBe(-30.5);
        expect(+contrastAPCA('#d667cb', '#b04646').toFixed(1)).toBe(-17.9);
    });
});
