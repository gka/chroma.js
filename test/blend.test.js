import { describe, it, expect } from 'vitest';
import chroma from '../dist/index.js';

const blend = chroma.blend;

describe('Testing blend modes', () => {
    it('multiply 1', () => {
        const result = blend('red', '#5a9f37', 'multiply');
        expect(result.hex()).toBe('#5a0000');
    });

    it('multiply 2', () => {
        const result = blend('#33b16f', '#857590', 'multiply');
        expect(result.hex()).toBe('#1b513f');
    });

    it('screen', () => {
        const result = blend('#b83d31', '#0da671', 'screen');
        expect(result.hex()).toBe('#bcbb8c');
    });

    it('overlay', () => {
        const result = blend('#b83d31', '#0da671', 'overlay');
        expect(result.hex()).toBe('#784f2b');
    });
});
