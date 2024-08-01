import { describe, it, expect } from 'vitest';
import chroma from '../dist/index.js';

const rnd = function (f, d) {
    d = Math.pow(10, d);
    return Math.round(f * d) / d;
};

describe('Testing relative luminance', () => {
    const testCases = [
        {
            name: 'black',
            topic: chroma('black'),
            expectedLuminance: 0
        },
        {
            name: 'white',
            topic: chroma('white'),
            expectedLuminance: 1
        },
        {
            name: 'red',
            topic: chroma('red'),
            precision: 4,
            expectedLuminance: 0.2126
        },
        {
            name: 'yellow brighter than blue',
            topic: [chroma('yellow').luminance(), chroma('blue').luminance()],
            comparison: 'greater'
        },
        {
            name: 'green darker than red',
            topic: [chroma('green').luminance(), chroma('red').luminance()],
            comparison: 'less'
        },
        {
            name: 'set red luminance to 0.4',
            topic: chroma('red').luminance(0.4),
            expectedLuminance: 0.4,
            precision: 3
        },
        {
            name: 'set red luminance to 0',
            topic: chroma('red').luminance(0),
            expectedLuminance: 0,
            precision: 2,
            expectedHex: '#000000'
        },
        {
            name: 'set black luminance to 0.5',
            topic: chroma('black').luminance(0.5),
            expectedLuminance: 0.5,
            expectedHex: '#bcbcbc'
        },
        {
            name: 'set black luminance to 0.5 (lab)',
            topic: chroma('black').luminance(0.5, 'lab'),
            expectedLuminance: 0.5,
            expectedHex: '#bcbcbc'
        }
    ];

    testCases.forEach(({ name, topic, expectedLuminance, expectedHex, precision = 2, comparison, steps }) => {
        if (comparison) {
            it(`${name}`, () => {
                if (comparison === 'greater') {
                    expect(topic[0]).toBeGreaterThan(topic[1]);
                } else if (comparison === 'less') {
                    expect(topic[0]).toBeLessThan(topic[1]);
                }
            });
        } else {
            it(`${name}: luminance = ${expectedLuminance}`, () => {
                expect(rnd(topic.luminance(), precision)).toBe(expectedLuminance);
            });
            if (expectedHex) {
                it(`${name}: hex = ${expectedHex}`, () => {
                    expect(topic.hex()).toBe(expectedHex);
                });
            }
        }
    });

    it('setting luminance returns new color', () => {
        const red = chroma('red');
        expect(rnd(red.luminance(), 2)).toBe(0.21);
        expect(red.hex()).toBe('#ff0000');
        const red2 = red.luminance(0.4);
        expect(red2.hex()).toBe('#ff8686');
    });
});
