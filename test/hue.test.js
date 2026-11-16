import { describe, it, expect } from 'vitest';
import chroma from 'chroma-js';

describe('Hues outside [0, 360) wrap around', () => {
    const spaces = {
        hsl: [1, 0.375],
        hsv: [1, 0.75],
        hsi: [1, 0.5],
        hcg: [1, 0.25]
    };
    const hues = [0, 60, 150, 300];
    const turns = [-3, -2, -1, 1, 2, 3, 10];

    Object.keys(spaces).forEach((space) => {
        hues.forEach((hue) => {
            const expected = chroma[space](hue, ...spaces[space]).rgb();
            turns.forEach((turn) => {
                const h = hue + turn * 360;
                it(`${space}(${h}, ${spaces[space]}) equals ${space}(${hue}, ${spaces[space]})`, () => {
                    expect(chroma[space](h, ...spaces[space]).rgb()).toEqual(expected);
                });
            });
        });
    });
});
