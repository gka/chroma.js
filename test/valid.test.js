import { describe, it, expect } from 'vitest';
import chroma from '../dist/index.js';

const valid = chroma.valid;

describe('Some tests for chroma.valid', () => {
    it('valid color', () => {
        expect(valid('red')).toBe(true);
    });

    it('invalid color', () => {
        expect(valid('bread')).toBe(false);
    });
});
