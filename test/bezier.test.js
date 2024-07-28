import { describe, it, expect } from 'vitest';
import chroma from '../index.js';

describe('Testing bezier interpolation', () => {
    describe('simple two color linear interpolation', () => {
        const f = chroma.bezier(['white', 'black']);
        
        it('starts from white', () => {
            expect(f(0).hex()).toBe('#ffffff');
        });
        
        it('ends in black', () => {
            expect(f(1).hex()).toBe('#000000');
        });
        
        it('center is grey', () => {
            expect(f(0.5).hex()).toBe('#777777');
        });
    });

    describe('three color quadratic bezier interpolation', () => {
        const f = chroma.bezier(['white', 'red', 'black']);
        
        it('starts from white', () => {
            expect(f(0).hex()).toBe('#ffffff');
        });
        
        it('ends in black', () => {
            expect(f(1).hex()).toBe('#000000');
        });
        
        it('center is a greyish red', () => {
            expect(f(0.5).hex()).toBe('#c45c44');
        });
    });

    describe('four color cubic bezier interpolation', () => {
        const f = chroma.bezier(['white', 'yellow', 'red', 'black']);
        
        it('starts from white', () => {
            expect(f(0).hex()).toBe('#ffffff');
        });
        
        it('ends in black', () => {
            expect(f(1).hex()).toBe('#000000');
        });
        
        it('1st quarter', () => {
            expect(f(0.25).hex()).toBe('#ffe085');
        });
        
        it('center', () => {
            expect(f(0.5).hex()).toBe('#e69735');
        });
        
        it('3rd quarter', () => {
            expect(f(0.75).hex()).toBe('#914213');
        });
    });

    describe('five color diverging quadratic bezier interpolation', () => {
        const f = chroma.bezier(['darkred', 'orange', 'snow', 'lightgreen', 'royalblue']);
        
        it('starts from darkred', () => {
            expect(f(0).hex()).toBe('#8b0000');
        });
        
        it('ends in royalblue', () => {
            expect(f(1).hex()).toBe('#4169e1');
        });
        
        it('1st quarter', () => {
            expect(f(0.25).hex()).toBe('#dd8d49');
        });
        
        it('center', () => {
            expect(f(0.5).hex()).toBe('#dfcb98');
        });
        
        it('3rd quarter', () => {
            expect(f(0.75).hex()).toBe('#a7c1bd');
        });
    });

    describe('using bezier in a chroma.scale', () => {
        const f = chroma.scale(chroma.bezier(['darkred', 'orange', 'snow', 'lightgreen', 'royalblue'])).domain([0, 1], 5).out('hex');
        
        it('starts from darkred', () => {
            expect(f(0)).toBe('#8b0000');
        });
        
        it('ends in royalblue', () => {
            expect(f(1)).toBe('#4169e1');
        });
        
        it('center is snow', () => {
            expect(f(0.5)).toBe('#dfcb98');
        });
        
        it('1st quarter', () => {
            expect(f(0.25)).toBe('#dd8d49');
        });
        
        it('3rd quarter', () => {
            expect(f(0.75)).toBe('#a7c1bd');
        });
    });
});
