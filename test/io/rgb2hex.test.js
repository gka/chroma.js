import { describe, it, expect } from 'vitest';
import rgb2hex from '../../src/io/hex/rgb2hex.js';

const tests = {
    black: { rgb: [0, 0, 0, 1], mode: 'auto', hex: '#000000' },
    white: { rgb: [255, 255, 255, 1], mode: 'auto', hex: '#ffffff' },
    gray: { rgb: [128, 128, 128, 1], mode: 'auto', hex: '#808080' },
    red: { rgb: [255, 0, 0, 1], mode: 'auto', hex: '#ff0000' },
    yellow: { rgb: [0, 255, 0, 1], mode: 'auto', hex: '#00ff00' },
    green: { rgb: [0, 0, 255, 1], mode: 'auto', hex: '#0000ff' },
    cyan: { rgb: [255, 255, 0, 1], mode: 'auto', hex: '#ffff00' },
    blue: { rgb: [0, 255, 255, 1], mode: 'auto', hex: '#00ffff' },
    magenta: { rgb: [255, 0, 255], mode: 'rgb', hex: '#ff00ff' },
    auto_rgba: { rgb: [255, 0, 255, 0.5], mode: 'auto', hex: '#ff00ff80' },
    force_rgba: { rgb: [255, 0, 255], mode: 'rgba', hex: '#ff00ffff' },
    force_rgb: { rgb: [255, 0, 255, 0.5], mode: 'rgb', hex: '#ff00ff' }
};

describe('Test rgb2hex color conversions', () => {
    Object.keys(tests).forEach((key) => {
        const { rgb, mode, hex } = tests[key];

        it(`rgb2hex ${key} converts array`, () => {
            expect(rgb2hex(rgb, mode || 'auto')).toBe(hex);
        });

        it(`rgb2hex ${key} converts object`, () => {
            const [r, g, b, a] = rgb;
            const obj = {
                r,
                g,
                b,
                ...(a !== undefined ? { a } : {})
            };
            expect(rgb2hex(obj, mode || 'auto')).toBe(hex);
        });

        it(`rgb2hex ${key} converts arguments`, () => {
            if (mode !== 'auto') return;
            expect(rgb2hex(...rgb)).toBe(hex);
        });
    });
});
