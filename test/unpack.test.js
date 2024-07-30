import { describe, it, expect } from 'vitest';
import unpack from '../src/utils/unpack.js';

describe('Testing unpack', () => {
    it('parse simple CMYK colors (args)', () => {
        expect(unpack([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
    });

    it('parse simple CMYK colors (array)', () => {
        expect(unpack([[1, 2, 3, 4]])).toEqual([1, 2, 3, 4]);
    });

    it('parse simple CMYK colors (object)', () => {
        expect(unpack([{ c: 1, m: 2, y: 3, k: 4 }], 'cmyk')).toEqual([1, 2, 3, 4]);
    });
});
