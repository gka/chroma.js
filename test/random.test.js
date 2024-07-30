import { describe, it, expect } from 'vitest';
import chroma from '../index.js';

describe('Some tests for random colors', () => {
    it('should generate valid hex codes for random colors', () => {
        const color = chroma.random();
        expect(/^#[0-9a-f]{6}$/i.test(color.hex())).toBe(true);
    });
});
