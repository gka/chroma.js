import { describe, it, expect } from 'vitest';
import chroma from 'chroma-js';

describe('ColorBrewer palettes', () => {
    it('should have all palettes', () => {
        expect(chroma.brewer).toBeDefined();
        expect(Object.keys(chroma.brewer).length).toBe(36);
    });

    it('brewer keys are camel-cased', () => {
        expect(Object.keys(chroma.brewer)[0]).toBe('OrRd');
        expect(Object.keys(chroma.brewer)[1]).toBe('PuBu');
    });

    it('supports case-insensitive access to palettes', () => {
        expect(chroma.brewer.RdYlBu).toBeDefined();
        expect(chroma.brewer.rdylbu).toBeDefined();
        expect(chroma.brewer.RdylBU).toBeDefined();
    });

    it('non existing palettes are still undefined', () => {
        expect(chroma.brewer.notHere).toBeUndefined();
    });
});
