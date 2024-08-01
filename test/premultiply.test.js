import { describe, it, expect } from 'vitest';
import chroma from '../dist/index.mjs';

describe('Premultiply colors', () => {
    it('premultiply rgba', () => {
        const c = chroma('rgba(32, 48, 96, 0.5)');
        expect(c.premultiply().rgba()).toEqual([16, 24, 48, 0.5]);
    });

    it('premultiply hex', () => {
        const c = chroma('rgba(32, 48, 96, 0.5)');
        expect(c.premultiply().hex()).toEqual('#10183080');
    });

    it('premultiply num', () => {
        const c = chroma('rgba(32, 48, 96, 0.5)');
        expect(c.premultiply().num()).toEqual(0x101830);
    });
});
