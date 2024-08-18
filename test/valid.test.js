import { describe, it, expect } from 'vitest';
import chroma from 'chroma-js';

const valid = chroma.valid;

describe('Some tests for chroma.valid', () => {
    it('valid color', () => {
        expect(valid('red')).toBe(true);
        expect(valid('transparent')).toBe(true);
    });

    it('invalid color', () => {
        expect(valid('bread')).toBe(false);
        expect(valid('unset')).toBe(false);
        expect(valid('inherit')).toBe(false);
    });
});
