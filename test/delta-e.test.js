import { describe, it, expect } from 'vitest';
import chroma from 'chroma-js';

const deltaE = chroma.deltaE;

// due to floating-point arithmetic on different devices, differences in decimals may be found.
// Running http://www.brucelindbloom.com/index.html?ColorDifferenceCalc.html JS code locally
// on the same device as the delta-e code in this library will provide the exact same results.
const tests = {
    nodifference: { in: [0x000000, 0x000000], out: 0 },
    maxdifference: { in: [0xffffff, 0x000000], out: 100 },
    redgreen: { in: [0xff0000, 0x00ff00], out: 86.6082374535373 },
    greenred: { in: [0x00ff00, 0xff0000], out: 86.6082374535373 },
    beef: { in: [0x00beef, 0x00beee], out: 0.28076037937072745 },
    yellowblue: { in: [0xffff00, 0x0000ff], out: 100 }
};

describe('Testing delta-e color difference calculations', () => {
    for (const key in tests) {
        const { in: input, out } = tests[key];
        it(key, () => {
            const result = deltaE(...input);
            expect(result).toBeCloseTo(out, 6);
        });
    }
});
