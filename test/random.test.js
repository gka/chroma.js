import { describe, it, expect } from 'vitest';
import chroma from 'chroma-js';
import { vitest } from 'vitest';

describe('Some tests for random colors', () => {
    it('should generate valid hex codes for random colors', () => {
        const color = chroma.random();
        expect(/^#[0-9a-f]{6}$/i.test(color.hex())).toBe(true);
    });

    it('should accept random number generator function as first argument', () => {
        const rng = vitest.fn(() => 0.5);
        const color = chroma.random(rng);
        expect(color.hex()).toBe('#888888');
        expect(rng).toHaveBeenCalled();
    });
});
