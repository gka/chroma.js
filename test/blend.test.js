import { describe, it, expect } from 'vitest';
import chroma from 'chroma-js';

const blend = chroma.blend;

describe('Testing blend modes', () => {
    it('multiply 1', () => {
        const result = blend('red', '#5a9f37', 'multiply');
        expect(result.hex()).toBe('#5a0000');
    });

    it('multiply 2', () => {
        const result = blend('#33b16f', '#857590', 'multiply');
        expect(result.hex()).toBe('#1b513f');
    });

    it('screen', () => {
        const result = blend('#b83d31', '#0da671', 'screen');
        expect(result.hex()).toBe('#bcbb8c');
    });

    it('overlay', () => {
        const result = blend('#b83d31', '#0da671', 'overlay');
        expect(result.hex()).toBe('#784f2b');
    });

    describe.each([
        ['normal', 80, 106.6666666667],
        ['multiply', 50.1960784314, 96.7320261438],
        ['screen', 189.8039215686, 143.2679738562],
        ['overlay', 124.6078431373, 121.5359477124],
        ['darken', 80, 106.6666666667],
        ['lighten', 160, 133.3333333333],
        ['dodge', 233.1428571429, 157.7142857143],
        ['burn', 0, 80]
    ])('%s alpha compositing', (mode, opaque, translucent) => {
        it('preserves opaque blending and composites two translucent colors', () => {
            const bottom = chroma.rgb(160, 160, 160);
            const top = chroma.rgb(80, 80, 80);
            const solid = blend(bottom, top, mode).rgba(false);
            const result = blend(bottom.alpha(0.5), top.alpha(0.5), mode);
            solid.slice(0, 3).forEach((v) => expect(v).toBeCloseTo(opaque));
            expect(solid[3]).toBe(1);
            result.rgb(false).forEach((v) => expect(v).toBeCloseTo(translucent));
            expect(result.alpha()).toBe(0.75);
        });

        it('ignores a transparent top color', () => {
            const result = blend([10, 20, 30, 0.5], [255, 0, 255, 0], mode);
            expect(result.rgba()).toEqual([10, 20, 30, 0.5]);
        });

        it('does not blend with a transparent bottom color', () => {
            const result = blend([255, 255, 255, 0], [10, 20, 30, 0.5], mode);
            expect(result.rgba()).toEqual([10, 20, 30, 0.5]);
        });

        it('returns transparent black for two transparent colors', () => {
            expect(blend([10, 20, 30, 0], [40, 50, 60, 0], mode).rgba()).toEqual([0, 0, 0, 0]);
        });

        it('supports the direct blend mode function without mutating inputs', () => {
            const bottom = chroma.rgb(10.4, 20.5, 30.6, 0.25);
            const top = chroma.rgb(100.2, 150.5, 200.8, 0.5);
            const before = [bottom.rgba(false), top.rgba(false)];
            expect(blend[mode](bottom, top).rgba(false)).toEqual(blend(bottom, top, mode).rgba(false));
            expect([bottom.rgba(false), top.rgba(false)]).toEqual(before);
        });
    });

    it('composites a translucent top over an opaque bottom', () => {
        expect(blend('blue', [255, 0, 0, 0.5], 'normal').rgba(false)).toEqual([127.5, 0, 127.5, 1]);
    });

    it('keeps source and backdrop alpha in their respective roles', () => {
        expect(blend([0, 0, 255, 0.25], [255, 0, 0, 0.5], 'normal').rgba(false)).toEqual([204, 0, 51, 0.625]);
    });

    it('retains RGB rounding when a transparent operand is ignored', () => {
        expect(blend([10.4, 20.5, 30.6, 0.5], [0, 0, 0, 0], 'normal').rgba(false)).toEqual([10, 21, 31, 0.5]);
        expect(blend([0, 0, 0, 0], [10.4, 20.5, 30.6, 0.5], 'normal').rgba(false)).toEqual([10, 21, 31, 0.5]);
    });

    it('composites alpha supplied by hex input', () => {
        expect(blend('blue', '#ff000000', 'normal').hex()).toBe('#0000ff');
        expect(blend('#00000000', '#ff000080', 'normal').hex()).toBe('#ff000080');
    });

    it('clips the burn result before applying opacity', () => {
        const result = blend([80, 80, 80], [50, 50, 50, 0.5], 'burn');
        expect(result.rgba(false)).toEqual([40, 40, 40, 1]);
    });

    it('handles a white burn backdrop with a black source', () => {
        expect(blend('white', 'black', 'burn').hex()).toBe('#ffffff');
        expect(blend([255, 255, 255, 0.5], [0, 0, 0, 0.5], 'burn').rgba(false)).toEqual([170, 170, 170, 0.75]);
    });

    it('preserves opaque burn clipping metadata', () => {
        const result = blend('#808080', 'black', 'burn');
        expect(result.hex()).toBe('#000000');
        expect(result.clipped()).toBe(true);
    });

    it('bounds alpha set through a mutating setter', () => {
        const top = chroma('red').alpha(2, true);
        const bottom = chroma('blue').alpha(-1, true);
        expect(blend(bottom, top, 'normal').rgba()).toEqual([255, 0, 0, 1]);
        expect([bottom.alpha(), top.alpha()]).toEqual([-1, 2]);
    });

    it('rejects a NaN alpha rather than returning invalid channels', () => {
        const top = chroma('red').alpha(NaN, true);
        expect(() => blend('blue', top, 'normal')).toThrow('invalid rgb color');
    });
});
