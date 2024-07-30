import { describe, it, expect } from 'vitest';
import { limits } from '../src/utils/analyze.js';

describe('Some tests for chroma.limits()', () => {
    const testCases = [
        {
            name: 'simple continuous domain',
            input: [[1, 2, 3, 4, 5], 'continuous'],
            expected: [1, 5]
        },
        {
            name: 'continuous domain, negative values',
            input: [[1, -2, -3, 4, 5], 'continuous'],
            expected: [-3, 5]
        },
        {
            name: 'continuous domain, null values',
            input: [[1, undefined, null, 4, 5], 'continuous'],
            expected: [1, 5]
        },
        {
            name: 'equidistant domain',
            input: [[0, 10], 'equidistant', 5],
            expected: [0, 2, 4, 6, 8, 10]
        },
        {
            name: 'equidistant domain, NaN values',
            input: [[0, 9, 3, 6, 3, 5, undefined, Number.NaN, 10], 'equidistant', 5],
            expected: [0, 2, 4, 6, 8, 10]
        },
        {
            name: 'logarithmic domain',
            input: [[1, 10000], 'log', 4],
            expected: [1, 10, 100, 1000, 10000]
        },
        {
            name: 'quantiles domain',
            input: [[1, 2, 3, 4, 5, 10, 20, 100], 'quantiles', 2],
            expected: [1, 4.5, 100]
        },
        {
            name: 'quantiles not enough values',
            input: [[0, 1], 'quantiles', 5],
            expected: [0, 0.2, 0.4, 0.6, 0.8, 1]
        }
    ];

    testCases.forEach(({ name, input, expected }) => {
        it(`${name}`, () => {
            expect(limits(...input)).toEqual(expected);
        });
    });

    it('logarithmic domain - non-positive values', () => {
        expect(() => limits([-1, 10000], 'log', 4)).toThrow('Logarithmic scales are only possible for values > 0');
    });
});
