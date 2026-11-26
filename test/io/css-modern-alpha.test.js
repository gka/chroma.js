import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import chroma from 'chroma-js';

describe('modern CSS alpha components', () => {
    const colors = [
        'rgb(10 20 30',
        'hsl(120 50% 50%',
        'lab(50% 0 0',
        'lch(50% 10 120',
        'oklab(50% 0 0',
        'oklch(50% 0.1 120'
    ];

    it('rejects long invalid whitespace without excessive backtracking', () => {
        execFileSync(
            process.execPath,
            [
                '--input-type=module',
                '-e',
                `import chroma from 'chroma-js';
                for (const color of ${JSON.stringify(colors)}) {
                    if (chroma.valid(color + ' '.repeat(100000) + 'x)')) {
                        throw new Error('invalid CSS color accepted');
                    }
                }`
            ],
            { timeout: 2000 }
        );
    });

    it.each(colors)('resolves missing alpha to zero in %s', (color) => {
        expect(chroma.css(`${color} / none)`).alpha()).toBe(0);
        expect(chroma(`${color} / none)`).alpha()).toBe(0);
    });

    it.each(colors)('clamps numeric alpha in %s', (color) => {
        expect(chroma.css(`${color} / 2)`).alpha()).toBe(1);
        expect(chroma.css(`${color} / -0.5)`).alpha()).toBe(0);
    });

    it.each(colors)(
        'accepts trailing whitespace after alpha in %s',
        (color) => {
            expect(chroma.css(`${color} / 50% \t)`).alpha()).toBe(0.5);
            expect(chroma.css(`${color} / .25)`).alpha()).toBe(0.25);
            expect(chroma.css(`${color})`).alpha()).toBe(1);
        }
    );
});
