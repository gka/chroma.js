import { describe, it, expect } from 'vitest';
import chroma from '../dist/index.mjs';

const cubehelix = chroma.cubehelix;

describe('Testing cubehelix colors', () => {
    it('default helix', () => {
        const color = cubehelix();
        // starts in black
        expect(color(0).hex()).toBe('#000000');
        // at 0.25
        expect(color(0.25).hex()).toBe('#16534c');
        // at 0.5
        expect(color(0.5).hex()).toBe('#a07949');
        // at 0.75
        expect(color(0.75).hex()).toBe('#c7b3ed');
        // ends in white
        expect(color(1).hex()).toBe('#ffffff');
    });

    it('red helix', () => {
        const color = cubehelix(0, 1, 1, 1);
        // starts in black
        expect(color(0).hex()).toBe('#000000');
        // at 0.25
        expect(color(0.25).hex()).toBe('#2e5117');
        // at 0.5
        expect(color(0.5).hex()).toBe('#4c949f');
        // at 0.75
        expect(color(0.75).hex()).toBe('#d1aee8');
        // ends in white
        expect(color(1).hex()).toBe('#ffffff');
    });

    it('red helix - partial l range', () => {
        const color = cubehelix(0, 1, 1, 1, [0.25, 0.75]);
        // starts
        expect(color(0).hex()).toBe('#663028');
        // at 0.25
        expect(color(0.25).hex()).toBe('#49752d');
        // at 0.5
        expect(color(0.5).hex()).toBe('#4c949f');
        // at 0.75
        expect(color(0.75).hex()).toBe('#b68ad2');
        // ends
        expect(color(1).hex()).toBe('#e6b0a8');
    });

    it('red helix - gamma', () => {
        const color = cubehelix(0, 1, 1, 0.8);
        // starts in black
        expect(color(0).hex()).toBe('#000000');
        // at 0.25
        expect(color(0.25).hex()).toBe('#3f6824');
        // at 0.5
        expect(color(0.5).hex()).toBe('#60a6b1');
        // at 0.75
        expect(color(0.75).hex()).toBe('#dabcee');
        // ends in white
        expect(color(1).hex()).toBe('#ffffff');
    });

    it('red helix - no saturation', () => {
        const color = cubehelix(0, 1, 0, 1, [0, 1]);
        // starts in black
        expect(color(0).hex()).toBe('#000000');
        // at 0.25
        expect(color(0.25).hex()).toBe('#404040');
        // at 0.5
        expect(color(0.5).hex()).toBe('#808080');
        // at 0.75
        expect(color(0.75).hex()).toBe('#bfbfbf');
        // ends in white
        expect(color(1).hex()).toBe('#ffffff');
    });

    it('red helix - saturation range', () => {
        const color = cubehelix(0, 1, [1, 0], 1);
        // starts in black
        expect(color(0).hex()).toBe('#000000');
        // at 0.25
        expect(color(0.25).hex()).toBe('#324c21');
        // at 0.5
        expect(color(0.5).hex()).toBe('#668a8f');
        // at 0.75
        expect(color(0.75).hex()).toBe('#c4bbc9');
        // ends in white
        expect(color(1).hex()).toBe('#ffffff');
        // saturation decreases
        expect(color(0.33).hsl()[1]).toBeGreaterThan(color(0.66).hsl()[1]);
    });

    it('non-array lightness', () => {
        const color = cubehelix(300, -1.5, 1, 1, 0.5);
        // starts
        expect(color(0).hex()).toBe('#ae629f');
        // at 0.5
        expect(color(0.5).hex()).toBe('#a07949');
        // ends
        expect(color(1).hex()).toBe('#519d60');
    });
});
