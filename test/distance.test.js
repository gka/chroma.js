import { describe, it, expect } from 'vitest';
import chroma from 'chroma-js';

const { distance } = chroma;

describe('Testing distance', () => {
    it('uses the lab color space by default', () => {
        expect(distance('#fff', '#ff0')).toBeCloseTo(96.948, 3);
    });

    it('rgb distance', () => {
        expect(distance('#fff', '#ff0', 'rgb')).toBe(255);
    });

    it('is zero for the same color', () => {
        expect(distance('#ff0000', '#ff0000', 'hsl')).toBe(0);
    });

    const nearZeroHue = {
        hsl: (h) => chroma.hsl(h, 0.5, 0.5),
        hsv: (h) => chroma.hsv(h, 0.5, 0.5),
        hsi: (h) => chroma.hsi(h, 0.5, 0.5),
        hcg: (h) => chroma.hcg(h, 0.5, 0.5),
        hcl: (h) => chroma.hcl(h, 30, 50),
        lch: (h) => chroma.lch(50, 30, h),
        oklch: (h) => chroma.oklch(0.6, 0.1, h)
    };
    for (const [mode, make] of Object.entries(nearZeroHue)) {
        it(`hue in ${mode} wraps around the color wheel`, () => {
            // hues 355 and 5 are 10 degrees apart, not 350
            const a = make(355);
            const b = make(5);
            expect(distance(a, b, mode)).toBeLessThan(15);
            expect(distance(b, a, mode)).toBeLessThan(15);
        });
    }

    it('hue difference is at most 180 degrees', () => {
        const a = chroma.hsl(10, 0.5, 0.5);
        const b = chroma.hsl(350, 0.5, 0.5);
        expect(distance(a, b, 'hsl')).toBeCloseTo(20, 6);
        expect(distance(chroma.hsl(0, 0.5, 0.5), chroma.hsl(180, 0.5, 0.5), 'hsl')).toBeCloseTo(180, 6);
    });
});
