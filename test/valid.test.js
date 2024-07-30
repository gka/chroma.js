import { describe, it, expect } from 'vitest';
import chroma from '../index.js';

describe('Some tests for chroma.valid', () => {
    it('valid color', () => {
        expect(chroma.valid('red')).toBe(true);
    });

    it('invalid color', () => {
        expect(chroma.valid('bread')).toBe(false);
    });
});
