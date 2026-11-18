import { describe, it, expect } from 'vitest';
import chroma from 'chroma-js';

const scale = chroma.scale;

describe('Testing lightness correction', () => {
    describe('simple two color linear interpolation', () => {
        const f = scale(['white', 'black']).mode('lab');

        it('center L is 50', () => {
            expect(Math.round(f(0.5).lab()[0])).toBe(50);
        });
    });

    describe('hot - w/o correction', () => {
        const f = scale(['white', 'yellow', 'red', 'black']).mode('lab');

        it('center L is 74', () => {
            expect(Math.round(f(0.5).lab()[0])).toBe(74);
        });
    });

    describe('hot - with correction', () => {
        const f = scale(['white', 'yellow', 'red', 'black']).mode('lab').correctLightness(true);

        it('center L is 50', () => {
            expect(Math.round(f(0.5).lab()[0])).toBe(50);
        });
    });

    describe('hot - w/o correction - domained [0,100]', () => {
        const f = scale(['white', 'yellow', 'red', 'black']).domain([0, 100]).mode('lab');

        it('center L is 74', () => {
            expect(Math.round(f(50).lab()[0])).toBe(74);
        });
    });

    describe('hot - with correction - domained [0,100]', () => {
        const f = scale(['white', 'yellow', 'red', 'black']).domain([0, 100]).mode('lab').correctLightness(true);

        it('center L is 50', () => {
            expect(Math.round(f(50).lab()[0])).toBe(50);
        });
    });

    describe('hot - w/o correction - domained [0,20,40,60,80,100]', () => {
        const f = scale(['white', 'yellow', 'red', 'black']).domain([0, 20, 40, 60, 80, 100]).mode('lab');

        it('center L is 74', () => {
            expect(Math.round(f(50).lab()[0])).toBe(74);
        });
    });

    describe('hot - with correction - domained [0,20,40,60,80,100]', () => {
        const f = scale(['white', 'yellow', 'red', 'black']).domain([0, 20, 40, 60, 80, 100]).mode('lab').correctLightness(true);

        it('center L is 50', () => {
            expect(Math.round(f(50).lab()[0])).toBe(50);
        });
    });

    describe('with correction - uneven domain [0,10,100]', () => {
        const f = scale(['white', 'black']).domain([0, 10, 100]).correctLightness(true);
        const linear = scale(['white', 'black']).correctLightness(true);

        it('10 is the center, L is 50', () => {
            expect(Math.round(f(10).lab()[0])).toBe(50);
        });

        it('matches the linear scale at the mapped positions', () => {
            for (const [value, t] of [
                [0, 0],
                [5, 0.25],
                [10, 0.5],
                [55, 0.75],
                [100, 1]
            ]) {
                expect(f(value).hex()).toBe(linear(t).hex());
            }
        });
    });

    describe('hot - with correction - uneven domain [0,10,100]', () => {
        const f = scale(['white', 'yellow', 'red', 'black']).domain([0, 10, 100]).mode('lab').correctLightness(true);

        it('10 is the center, L is 50', () => {
            expect(Math.round(f(10).lab()[0])).toBe(50);
        });
    });
});
