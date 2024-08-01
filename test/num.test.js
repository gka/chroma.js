import { describe, it, expect } from 'vitest';
import chroma from '../dist/index.js';

describe('Some tests for chroma.num()', () => {
    it('number output', () => {
        const color = chroma.hsl(0, 1, 0.5, 0.5);
        expect(color.num()).toBe(0xff0000);
    });

    it('num color', () => {
        const colors = [chroma(0xff0000), chroma(0x000000), chroma(0xffffff), chroma(0x31ff98), chroma('red')];

        expect(colors[0].hex()).toBe('#ff0000');
        expect(colors[0].num()).toBe(0xff0000);

        expect(colors[1].hex()).toBe('#000000');
        expect(colors[1].num()).toBe(0x000000);

        expect(colors[2].hex()).toBe('#ffffff');
        expect(colors[2].num()).toBe(0xffffff);

        expect(colors[3].hex()).toBe('#31ff98');
        expect(colors[3].num()).toBe(0x31ff98);

        expect(colors[4].num()).toBe(0xff0000);
    });
});
