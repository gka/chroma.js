import { describe, it, expect } from 'vitest';
import {analyze} from '../src/utils/analyze.js';

describe('Some tests for analyze()', () => {
    it('analyze an array of numbers', () => {
        const result = analyze([1, 2, 2, 3, 4, 5]);
        expect(result.sum).toBe(17);
        expect(result.count).toBe(6);
        expect(result.max).toBe(5);
        expect(result.min).toBe(1);
        expect(result.domain).toEqual([1, 5]);
    });

    it('analyze an object of numbers', () => {
        const result = analyze({ a: 1, b: 2, c: 2, d: 3, e: 4, f: 5 });
        expect(result.sum).toBe(17);
        expect(result.count).toBe(6);
        expect(result.max).toBe(5);
        expect(result.min).toBe(1);
        expect(result.domain).toEqual([1, 5]);
    });

    it('analyze an array of objects', () => {
        const result = analyze([{ k: 1 }, { k: 2 }, { k: 2 }, { k: 3 }, { k: 4 }, { k: 5 }], 'k');
        expect(result.sum).toBe(17);
        expect(result.count).toBe(6);
        expect(result.max).toBe(5);
        expect(result.min).toBe(1);
        expect(result.domain).toEqual([1, 5]);
    });

    it('analyze an object of objects', () => {
        const result = analyze({ a: { k: 1 }, b: { k: 2 }, c: { k: 2 }, d: { k: 3 }, e: { k: 4 }, f: { k: 5 }}, 'k');
        expect(result.sum).toBe(17);
        expect(result.count).toBe(6);
        expect(result.max).toBe(5);
        expect(result.min).toBe(1);
        expect(result.domain).toEqual([1, 5]);
    });
});
