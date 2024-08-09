import { describe, it, expect } from 'vitest';
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
