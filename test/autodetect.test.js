import { describe, it, expect } from 'vitest';
import chroma from 'chroma-js';

describe('autodetect color', () => {
    it('autodetect named color', () => {
        const result = chroma('red');
        expect(result.hex()).toBe('#ff0000');
        expect(result.rgb()).toStrictEqual([255, 0, 0]);
    });

    it('autodetect hex color', () => {
        const result = chroma('#00ff00');
        expect(result.name()).toBe('lime');
    });

    it('autodetect hex color, no #', () => {
        const result = chroma('00ff00');
        expect(result.name()).toBe('lime');
    });

    it('autodetect 3-digit hex color, no #', () => {
        const result = chroma('0F0');
        expect(result.name()).toBe('lime');
        expect(result.alpha()).toBe(1);
    });

    it('autodetect 4-digit hex color', () => {
        const result = chroma('#0F09');
        expect(result.name()).toBe('lime');
        expect(result.alpha()).toBe(0.6);
    });

    it('autodetect RGB color', () => {
        const result = chroma(0, 0, 255);
        expect(result.hex()).toBe('#0000ff');
    });

    it('autodetect rgba color', () => {
        const result = chroma(255, 0, 0, 0.5);
        expect(result.css()).toBe('rgba(255,0,0,0.5)');
    });

    it('autodetect hsl color', () => {
        const result = chroma('hsl(120, 100%, 50%)');
        expect(result.name()).toBe('lime');
    });
});
