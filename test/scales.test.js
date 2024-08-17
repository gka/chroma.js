import { describe, it, expect } from 'vitest';
import chroma from 'chroma-js';

const scale = chroma.scale;

describe('Some tests for scale()', () => {
    describe('simple rgb scale (white-->black)', () => {
        const f = scale(['white', 'black']);

        it('starts white', () => {
            expect(f(0).hex()).toBe('#ffffff');
        });

        it('mid gray', () => {
            expect(f(0.5).hex()).toBe('#808080');
        });

        it('ends black', () => {
            expect(f(1).hex()).toBe('#000000');
        });
    });

    describe('simple hsv scale (white-->black)', () => {
        const f = scale(['white', 'black']).mode('hsv');

        it('starts white', () => {
            expect(f(0).hex()).toBe('#ffffff');
        });

        it('mid gray', () => {
            expect(f(0.5).hex()).toBe('#808080');
        });

        it('ends black', () => {
            expect(f(1).hex()).toBe('#000000');
        });

        it('colors', () => {
            expect(f.colors()).toEqual(['#ffffff', '#000000']);
        });

        it('colors start and end', () => {
            expect(f.colors(2)).toEqual(['#ffffff', '#000000']);
        });

        it('color mode', () => {
            expect(f.colors(2, 'rgb')[1]).toEqual([0, 0, 0]);
        });

        it('color mode null len', () => {
            expect(f.colors(2, null).length).toBe(2);
        });

        it('color mode null', () => {
            expect(f.colors(2, null)[0]._rgb).toBeDefined();
        });
    });

    describe('simple hsv scale (white-->black), classified', () => {
        const f = scale(['white', 'black']).classes(7).mode('hsv');

        it('starts white', () => {
            expect(f(0).hex()).toBe('#ffffff');
        });

        it('mid gray', () => {
            expect(f(0.5).hex()).toBe('#808080');
        });

        it('ends black', () => {
            expect(f(1).hex()).toBe('#000000');
        });

        it('colors', () => {
            expect(f.colors(7)).toEqual(['#ffffff', '#d5d5d5', '#aaaaaa', '#808080', '#555555', '#2a2a2a', '#000000']);
        });
    });

    describe('simple lab scale (white-->black)', () => {
        const f = scale(['white', 'black']).mode('lab');

        it('starts white', () => {
            expect(f(0).hex()).toBe('#ffffff');
        });

        it('mid gray', () => {
            expect(f(0.5).hex()).toBe('#777777');
        });

        it('ends black', () => {
            expect(f(1).hex()).toBe('#000000');
        });
    });

    describe('colorbrewer scale', () => {
        const f = scale('RdYlGn');

        it('starts white', () => {
            expect(f(0).hex()).toBe('#a50026');
        });

        it('mid gray', () => {
            expect(f(0.5).hex()).toBe('#ffffbf');
        });

        it('ends black', () => {
            expect(f(1).hex()).toBe('#006837');
        });
    });

    describe('colorbrewer scale - domained', () => {
        const f = scale('RdYlGn').domain([0, 100]);

        it('starts white', () => {
            expect(f(0).hex()).toBe('#a50026');
        });

        it('foo', () => {
            expect(f(10).hex()).not.toBe('#ffffbf');
        });

        it('mid gray', () => {
            expect(f(50).hex()).toBe('#ffffbf');
        });

        it('ends black', () => {
            expect(f(100).hex()).toBe('#006837');
        });

        it('returns domain', () => {
            expect(f.domain()).toEqual([0, 100]);
        });
    });

    describe('colorbrewer scale - lowercase', () => {
        const f = scale('rdylgn');

        it('starts white', () => {
            expect(f(0).hex()).toBe('#a50026');
        });

        it('mid gray', () => {
            expect(f(0.5).hex()).toBe('#ffffbf');
        });

        it('ends black', () => {
            expect(f(1).hex()).toBe('#006837');
        });
    });

    describe('colorbrewer scale - domained - classified', () => {
        const f = scale('RdYlGn').domain([0, 100]).classes(5);

        it('starts white', () => {
            expect(f(0).hex()).toBe('#a50026');
        });

        it('10', () => {
            expect(f(10).hex()).toBe('#a50026');
        });

        it('mid gray', () => {
            expect(f(50).hex()).toBe('#ffffbf');
        });

        it('ends black', () => {
            expect(f(100).hex()).toBe('#006837');
        });

        it('get colors', () => {
            expect(f.colors(5)).toEqual(['#a50026', '#f98e52', '#ffffbf', '#86cb67', '#006837']);
        });
    });

    describe('calling domain with no arguments', () => {
        const f = scale('RdYlGn').domain([0, 100]).classes(5);

        it('returns domain', () => {
            expect(f.domain()).toEqual([0, 100]);
        });

        it('returns classes', () => {
            expect(f.classes()).toEqual([0, 20, 40, 60, 80, 100]);
        });
    });

    describe('source array keeps untouched', () => {
        const colors = chroma.brewer.Blues.slice(0);

        it('colors are an array', () => {
            expect(colors.length).toBe(9);
        });

        it('colors are strings', () => {
            expect(typeof colors[0]).toBe('string');
        });

        it('creating a color scale', () => {
            scale(colors);
            expect(true).toBe(true);
        });

        it('colors are still strings', () => {
            expect(typeof colors[0]).toBe('string');
        });
    });

    describe('domain with same min and max', () => {
        const f = scale(['white', 'black']).domain([1, 1]);

        it('returns color', () => {
            expect(f(1).hex()).toBe('#000000');
        });
    });

    describe('simple num scale (white-->black)', () => {
        const f = scale(['white', 'black']).mode('num');

        it('starts white', () => {
            expect(f(0).hex()).toBe('#ffffff');
        });

        it('25%', () => {
            expect(f(0.25).hex()).toBe('#bfffff');
        });

        it('50%', () => {
            expect(f(0.5).hex()).toBe('#7fffff');
        });

        it('75%', () => {
            expect(f(0.75).hex()).toBe('#3fffff');
        });

        it('95%', () => {
            expect(f(0.95).hex()).toBe('#0ccccc');
        });

        it('ends black', () => {
            expect(f(1).hex()).toBe('#000000');
        });
    });

    describe('css rgb colors', () => {
        const color = scale('YlGnBu')(0.3).css();

        it('have rounded rgb() values', () => {
            expect(color).toBe('rgb(170 222 183)');
        });
    });

    describe('css rgba colors', () => {
        const color = scale('YlGnBu')(0.3).alpha(0.675).css();

        it('dont round alpha value', () => {
            expect(color).toBe('rgb(170 222 183 / 0.675)');
        });
    });

    describe('get colors from a scale', () => {
        const f = scale(['yellow', 'darkgreen']);

        it('just colors', () => {
            expect(f.colors()).toEqual(['#ffff00', '#006400']);
        });

        it('five hex colors', () => {
            expect(f.colors(5)).toEqual(['#ffff00', '#bfd800', '#80b200', '#408b00', '#006400']);
        });

        it('three css colors', () => {
            expect(f.colors(3, 'css')).toEqual(['rgb(255 255 0)', 'rgb(128 178 0)', 'rgb(0 100 0)']);
        });
    });

    describe('get colors from a scale', () => {
        const f = scale(['yellow', 'darkgreen']);

        it('just colors', () => {
            expect(f.colors()).toEqual(['#ffff00', '#006400']);
        });

        it('five hex colors', () => {
            expect(f.colors(5)).toEqual(['#ffff00', '#bfd800', '#80b200', '#408b00', '#006400']);
        });

        it('three css colors', () => {
            expect(f.colors(3, 'css')).toEqual(['rgb(255 255 0)', 'rgb(128 178 0)', 'rgb(0 100 0)']);
        });
    });

    describe('get colors from a scale with more than two colors', () => {
        const f = scale(['yellow', 'orange', 'darkgreen']);

        it('just original colors', () => {
            expect(f.colors()).toEqual(['#ffff00', '#ffa500', '#006400']);
        });
    });

    describe('test example in readme', () => {
        const f = scale('RdYlGn');

        it('five hex colors (new)', () => {
            expect(f.colors(5)).toEqual(['#a50026', '#f98e52', '#ffffbf', '#86cb67', '#006837']);
        });
    });

    describe('weird result', () => {
        const f = scale([
            [0, 0, 0, 1],
            [255, 255, 255, 1]
        ])
            .domain([0, 10])
            .mode('rgb');

        it('has hex function at 0.5', () => {
            expect(typeof f(0.5).hex).toBe('function');
        });

        it('has hex function at 0', () => {
            expect(typeof f(0).hex).toBe('function');
        });
    });

    describe('scale padding, simple', () => {
        const f = scale('RdYlBu').padding(0.15);

        it('0', () => {
            expect(f(0).hex()).toBe('#e64f35');
        });

        it('0.5', () => {
            expect(f(0.5).hex()).toBe('#ffffbf');
        });

        it('1', () => {
            expect(f(1).hex()).toBe('#5d91c3');
        });
    });

    describe('scale padding, one-sided', () => {
        const f = scale('OrRd').padding([0.2, 0]);

        it('0', () => {
            expect(f(0).hex()).toBe('#fddcaf');
        });

        it('0.5', () => {
            expect(f(0.5).hex()).toBe('#f26d4b');
        });

        it('1', () => {
            expect(f(1).hex()).toBe('#7f0000');
        });
    });

    describe('colors return original colors', () => {
        const f = scale(['red', 'white', 'blue']);

        it('same colors', () => {
            expect(f.colors()).toEqual(['#ff0000', '#ffffff', '#0000ff']);
        });
    });

    describe('scale with one color', () => {
        const f = scale(['red']);

        it('should return that color', () => {
            expect(f(0.3).hex()).toBe('#ff0000');
        });
    });

    describe('scale() no data color', () => {
        const f = scale('OrRd');

        it('null --> nodata', () => {
            expect(f(null).hex()).toBe('#cccccc');
        });

        it('undefined --> nodata', () => {
            expect(f(undefined).hex()).toBe('#cccccc');
        });

        it('custom nodata color', () => {
            expect(f.nodata('#eee')(undefined).hex()).toBe('#eeeeee');
        });
    });

    describe('scale wrapped in a scale', () => {
        const f1 = scale('OrRd');
        const f = scale('OrRd').domain([0, 0.25, 1]);

        it('start', () => {
            expect(f(0).hex()).toBe(f1(0).hex());
        });

        it('end', () => {
            expect(f(1).hex()).toBe(f1(1).hex());
        });

        it('center', () => {
            expect(f(0.125).hex()).toBe(f1(0.25).hex());
        });

        it('center2', () => {
            expect(f(0.25).hex()).toBe(f1(0.5).hex());
        });

        it('center3', () => {
            expect(f(0.625).hex()).toBe(f1(0.75).hex());
        });
    });
});
