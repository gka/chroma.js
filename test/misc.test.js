import { describe, it, expect } from 'vitest';
import chroma from 'chroma-js';

const round = function (digits) {
    var d;
    d = Math.pow(10, digits);
    return function (v) {
        return Math.round(v * d) / d;
    };
};

describe('Some tests for chroma.lch()', () => {
    describe('hsv black', () => {
        it('hue is NaN', () => {
            expect(chroma('black').hsv()[0]).toBeNaN();
        });

        it('but hue is defined', () => {
            expect(chroma('black').hsv()[0] != null).toBeTruthy();
        });
    });

    describe('toString', () => {
        it('explicit .toString()', () => {
            expect(chroma('greenyellow').toString()).toEqual('#adff2f');
        });

        it('implicit add to string', () => {
            expect('' + chroma('greenyellow')).toEqual('#adff2f');
        });

        it('implicit cast as String', () => {
            expect(String(chroma('greenyellow'))).toEqual('#adff2f');
        });
    });

    describe('constructing numeric color', () => {
        it('from 0xRRGGBB', () => {
            expect(chroma.num(0xadff2f).name()).toEqual('greenyellow');
        });

        it('alpha is 100%', () => {
            expect(chroma.num(0xadff2f).alpha()).toEqual(1);
        });
    });

    describe('normalize hue', () => {
        it('hue > 0', () => {
            expect(chroma.rgb(0, 255, 255).lch()[2] >= 0).toBeTruthy();
        });

        it('hue < 360', () => {
            expect(chroma.rgb(0, 255, 255).lch()[2] <= 360).toBeTruthy();
        });
    });

    describe('lab conversions', () => {
        /** @type {[string, [number, number, number]][]} */
        const colors = [
            ['red', [53.241, 80.092, 67.203]],
            ['blue', [32.297, 79.188, -107.86]],
            ['green', [46.227, -51.698, 49.897]],
            ['yellow', [97.139, -21.554, 94.478]],
            ['magenta', [60.324, 98.234, -60.825]]
        ];

        colors.forEach(([name, lab]) => {
            it(name, () => {
                expect(chroma(name).lab().map(round(3))).toEqual(lab);
            });
        });
    });
});

// vows.describe('Some tests for chroma.color()')
//     .addBatch({

//         'hueless css hsl colors': {
//             topic: [chroma('black'), chroma('gray'), chroma('white')],
//             black: function (topic) {
//                 return assert.equal(topic[0].css('hsl'), 'hsl(0,0%,0%)');
//             },
//             gray: function (topic) {
//                 return assert.equal(topic[1].css('hsl'), 'hsl(0,0%,50.2%)');
//             },
//             white: function (topic) {
//                 return assert.equal(topic[2].css('hsl'), 'hsl(0,0%,100%)');
//             }
//         },
//         'hcl.h is NaN for hue-less colors': {
//             topic: [chroma('black'), chroma('gray'), chroma('white')],
//             black: function (topic) {
//                 return assert.isNaN(topic[0].hcl()[0]);
//             },
//             gray: function (topic) {
//                 return assert.isNaN(topic[1].hcl()[0]);
//             },
//             white: function (topic) {
//                 return assert.isNaN(topic[2].hcl()[0]);
//             }
//         },
//         'lab-rgb precision': {
//             topic: [74, 24, 78],
//             to_rgb_to_lab: function (topic) {
//                 return assert.deepEqual(
//                     chroma
//                         .rgb(chroma.lab(topic).rgb(false))
//                         .lab()
//                         .map(round(3)),
//                     topic
//                 );
//             }
//         },
//         'cmyk-rgb precision': {
//             topic: [0, 1, 1, 0.02],
//             to_rgb_to_cmyk: function (topic) {
//                 return assert.deepEqual(
//                     chroma
//                         .rgb(chroma.cmyk(topic).rgb(false))
//                         .cmyk()
//                         .map(round(3)),
//                     topic
//                 );
//             }
//         },
//         'auto-detect rgba in hex output': {
//             topic: ['rgba(255,0,0,1)', 'rgba(255,0,0,0.5)'],
//             'rgb if alpha == 1': function (topic) {
//                 return assert.equal(chroma(topic[0]).hex(), '#ff0000');
//             },
//             'rgba if alpha != 1': function (topic) {
//                 return assert.equal(chroma(topic[1]).hex(), '#ff000080');
//             }
//         }
//     })
//     ['export'](module);
