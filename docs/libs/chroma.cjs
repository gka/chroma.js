/**
 * chroma.js - JavaScript library for color conversions
 *
 * Copyright (c) 2011-2024, Gregor Aisch
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. The name Gregor Aisch may not be used to endorse or promote products
 * derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL GREGOR AISCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * -------------------------------------------------------
 *
 * chroma.js includes colors from colorbrewer2.org, which are released under
 * the following license:
 *
 * Copyright (c) 2002 Cynthia Brewer, Mark Harrower,
 * and The Pennsylvania State University.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * ------------------------------------------------------
 *
 * Named colors are taken from X11 Color Names.
 * http://www.w3.org/TR/css3-color/#svg-color
 *
 * @preserve
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.chroma = factory());
})(this, (function () { 'use strict';

    var min$4 = Math.min;
    var max$4 = Math.max;

    function limit (x, low, high) {
        if ( low === void 0 ) low = 0;
        if ( high === void 0 ) high = 1;

        return min$4(max$4(low, x), high);
    }

    function clip_rgb (rgb) {
        rgb._clipped = false;
        rgb._unclipped = rgb.slice(0);
        for (var i = 0; i <= 3; i++) {
            if (i < 3) {
                if (rgb[i] < 0 || rgb[i] > 255) { rgb._clipped = true; }
                rgb[i] = limit(rgb[i], 0, 255);
            } else if (i === 3) {
                rgb[i] = limit(rgb[i], 0, 1);
            }
        }
        return rgb;
    }

    // ported from jQuery's $.type
    var classToType = {};
    for (var i = 0, list = [
        'Boolean',
        'Number',
        'String',
        'Function',
        'Array',
        'Date',
        'RegExp',
        'Undefined',
        'Null'
    ]; i < list.length; i += 1) {
        var name = list[i];

        classToType[("[object " + name + "]")] = name.toLowerCase();
    }
    function type (obj) {
        return classToType[Object.prototype.toString.call(obj)] || 'object';
    }

    function unpack (args, keyOrder) {
        if ( keyOrder === void 0 ) keyOrder = null;

        // if called with more than 3 arguments, we return the arguments
        if (args.length >= 3) { return Array.prototype.slice.call(args); }
        // with less than 3 args we check if first arg is object
        // and use the keyOrder string to extract and sort properties
        if (type(args[0]) == 'object' && keyOrder) {
            return keyOrder
                .split('')
                .filter(function (k) { return args[0][k] !== undefined; })
                .map(function (k) { return args[0][k]; });
        }
        // otherwise we just return the first argument
        // (which we suppose is an array of args)
        return args[0].slice(0);
    }

    function last (args) {
        if (args.length < 2) { return null; }
        var l = args.length - 1;
        if (type(args[l]) == 'string') { return args[l].toLowerCase(); }
        return null;
    }

    var PI$2 = Math.PI;
    var min$3 = Math.min;
    var max$3 = Math.max;

    var rnd2 = function (a) { return Math.round(a * 100) / 100; };
    var rnd3 = function (a) { return Math.round(a * 100) / 100; };

    var TWOPI = PI$2 * 2;
    var PITHIRD = PI$2 / 3;
    var DEG2RAD = PI$2 / 180;
    var RAD2DEG = 180 / PI$2;

    /**
     * Reverse the first three elements of an array
     *
     * @param {any[]} arr
     * @returns {any[]}
     */
    function reverse3(arr) {
        return arr.slice(0, 3).reverse().concat( arr.slice(3));
    }

    var input = {
        format: {},
        autodetect: []
    };

    var Color = function Color() {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var me = this;
        if (
            type(args[0]) === 'object' &&
            args[0].constructor &&
            args[0].constructor === this.constructor
        ) {
            // the argument is already a Color instance
            return args[0];
        }
        // last argument could be the mode
        var mode = last(args);
        var autodetect = false;
        if (!mode) {
            autodetect = true;

            if (!input.sorted) {
                input.autodetect = input.autodetect.sort(function (a, b) { return b.p - a.p; });
                input.sorted = true;
            }

            // auto-detect format
            for (var i = 0, list = input.autodetect; i < list.length; i += 1) {
                var chk = list[i];

                mode = chk.test.apply(chk, args);
                if (mode) { break; }
            }
        }
        if (input.format[mode]) {
            var rgb = input.format[mode].apply(
                null,
                autodetect ? args : args.slice(0, -1)
            );
            me._rgb = clip_rgb(rgb);
        } else {
            throw new Error('unknown format: ' + args);
        }
        // add alpha channel
        if (me._rgb.length === 3) { me._rgb.push(1); }
    };
    Color.prototype.toString = function toString () {
        if (type(this.hex) == 'function') { return this.hex(); }
        return ("[" + (this._rgb.join(',')) + "]");
    };

    // this gets updated automatically
    var version = '3.1.2';

    var chroma = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color, [ null ].concat( args) ));
    };

    chroma.version = version;

    var cmyk2rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack(args, 'cmyk');
        var c = args[0];
        var m = args[1];
        var y = args[2];
        var k = args[3];
        var alpha = args.length > 4 ? args[4] : 1;
        if (k === 1) { return [0, 0, 0, alpha]; }
        return [
            c >= 1 ? 0 : 255 * (1 - c) * (1 - k), // r
            m >= 1 ? 0 : 255 * (1 - m) * (1 - k), // g
            y >= 1 ? 0 : 255 * (1 - y) * (1 - k), // b
            alpha
        ];
    };

    var max$2 = Math.max;

    var rgb2cmyk = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        r = r / 255;
        g = g / 255;
        b = b / 255;
        var k = 1 - max$2(r, max$2(g, b));
        var f = k < 1 ? 1 / (1 - k) : 0;
        var c = (1 - r - k) * f;
        var m = (1 - g - k) * f;
        var y = (1 - b - k) * f;
        return [c, m, y, k];
    };

    Color.prototype.cmyk = function () {
        return rgb2cmyk(this._rgb);
    };

    var cmyk = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color, [ null ].concat( args, ['cmyk']) ));
    };
    Object.assign(chroma, { cmyk: cmyk });

    input.format.cmyk = cmyk2rgb;

    input.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack(args, 'cmyk');
            if (type(args) === 'array' && args.length === 4) {
                return 'cmyk';
            }
        }
    });

    /*
     * supported arguments:
     * - hsl2css(h,s,l)
     * - hsl2css(h,s,l,a)
     * - hsl2css([h,s,l], mode)
     * - hsl2css([h,s,l,a], mode)
     * - hsl2css({h,s,l,a}, mode)
     */
    var hsl2css = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var hsla = unpack(args, 'hsla');
        var mode = last(args) || 'lsa';
        hsla[0] = rnd2(hsla[0] || 0) + 'deg';
        hsla[1] = rnd2(hsla[1] * 100) + '%';
        hsla[2] = rnd2(hsla[2] * 100) + '%';
        if (mode === 'hsla' || (hsla.length > 3 && hsla[3] < 1)) {
            hsla[3] = '/ ' + (hsla.length > 3 ? hsla[3] : 1);
            mode = 'hsla';
        } else {
            hsla.length = 3;
        }
        return ((mode.substr(0, 3)) + "(" + (hsla.join(' ')) + ")");
    };

    /*
     * supported arguments:
     * - rgb2hsl(r,g,b)
     * - rgb2hsl(r,g,b,a)
     * - rgb2hsl([r,g,b])
     * - rgb2hsl([r,g,b,a])
     * - rgb2hsl({r,g,b,a})
     */
    var rgb2hsl$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack(args, 'rgba');
        var r = args[0];
        var g = args[1];
        var b = args[2];

        r /= 255;
        g /= 255;
        b /= 255;

        var minRgb = min$3(r, g, b);
        var maxRgb = max$3(r, g, b);

        var l = (maxRgb + minRgb) / 2;
        var s, h;

        if (maxRgb === minRgb) {
            s = 0;
            h = Number.NaN;
        } else {
            s =
                l < 0.5
                    ? (maxRgb - minRgb) / (maxRgb + minRgb)
                    : (maxRgb - minRgb) / (2 - maxRgb - minRgb);
        }

        if (r == maxRgb) { h = (g - b) / (maxRgb - minRgb); }
        else if (g == maxRgb) { h = 2 + (b - r) / (maxRgb - minRgb); }
        else if (b == maxRgb) { h = 4 + (r - g) / (maxRgb - minRgb); }

        h *= 60;
        if (h < 0) { h += 360; }
        if (args.length > 3 && args[3] !== undefined) { return [h, s, l, args[3]]; }
        return [h, s, l];
    };

    /*
     * supported arguments:
     * - lab2css(l,a,b)
     * - lab2css(l,a,b,alpha)
     * - lab2css([l,a,b], mode)
     * - lab2css([l,a,b,alpha], mode)
     */
    var lab2css = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var laba = unpack(args, 'lab');
        var mode = last(args) || 'lab';
        laba[0] = rnd2(laba[0]) + '%';
        laba[1] = rnd2(laba[1]);
        laba[2] = rnd2(laba[2]);
        if (mode === 'laba' || (laba.length > 3 && laba[3] < 1)) {
            laba[3] = '/ ' + (laba.length > 3 ? laba[3] : 1);
        } else {
            laba.length = 3;
        }
        return ("lab(" + (laba.join(' ')) + ")");
    };

    var labConstants = {
        // Corresponds roughly to RGB brighter/darker
        Kn: 18,

        // D65 standard referent
        labWhitePoint: 'd65',
        Xn: 0.95047,
        Yn: 1,
        Zn: 1.08883,

        t0: 0.137931034, // 4 / 29
        t1: 0.206896552, // 6 / 29
        t2: 0.12841855, // 3 * t1 * t1
        t3: 0.008856452, // t1 * t1 * t1,

        kE: 216.0 / 24389.0,
        kKE: 8.0,
        kK: 24389.0 / 27.0,

        RefWhiteRGB: {
            // sRGB
            X: 0.95047,
            Y: 1,
            Z: 1.08883
        },

        MtxRGB2XYZ: {
            m00: 0.4124564390896922,
            m01: 0.21267285140562253,
            m02: 0.0193338955823293,
            m10: 0.357576077643909,
            m11: 0.715152155287818,
            m12: 0.11919202588130297,
            m20: 0.18043748326639894,
            m21: 0.07217499330655958,
            m22: 0.9503040785363679
        },

        MtxXYZ2RGB: {
            m00: 3.2404541621141045,
            m01: -0.9692660305051868,
            m02: 0.055643430959114726,
            m10: -1.5371385127977166,
            m11: 1.8760108454466942,
            m12: -0.2040259135167538,
            m20: -0.498531409556016,
            m21: 0.041556017530349834,
            m22: 1.0572251882231791
        },

        // used in rgb2xyz
        As: 0.9414285350000001,
        Bs: 1.040417467,
        Cs: 1.089532651,

        MtxAdaptMa: {
            m00: 0.8951,
            m01: -0.7502,
            m02: 0.0389,
            m10: 0.2664,
            m11: 1.7135,
            m12: -0.0685,
            m20: -0.1614,
            m21: 0.0367,
            m22: 1.0296
        },

        MtxAdaptMaI: {
            m00: 0.9869929054667123,
            m01: 0.43230526972339456,
            m02: -0.008528664575177328,
            m10: -0.14705425642099013,
            m11: 0.5183602715367776,
            m12: 0.04004282165408487,
            m20: 0.15996265166373125,
            m21: 0.0492912282128556,
            m22: 0.9684866957875502
        }
    };

    // taken from https://de.mathworks.com/help/images/ref/whitepoint.html
    var ILLUMINANTS = new Map([
        // ASTM E308-01
        ['a', [1.0985, 0.35585]],
        // Wyszecki & Stiles, p. 769
        ['b', [1.0985, 0.35585]],
        // C ASTM E308-01
        ['c', [0.98074, 1.18232]],
        // D50 (ASTM E308-01)
        ['d50', [0.96422, 0.82521]],
        // D55 (ASTM E308-01)
        ['d55', [0.95682, 0.92149]],
        // D65 (ASTM E308-01)
        ['d65', [0.95047, 1.08883]],
        // E (ASTM E308-01)
        ['e', [1, 1, 1]],
        // F2 (ASTM E308-01)
        ['f2', [0.99186, 0.67393]],
        // F7 (ASTM E308-01)
        ['f7', [0.95041, 1.08747]],
        // F11 (ASTM E308-01)
        ['f11', [1.00962, 0.6435]],
        ['icc', [0.96422, 0.82521]]
    ]);

    function setLabWhitePoint(name) {
        var ill = ILLUMINANTS.get(String(name).toLowerCase());
        if (!ill) {
            throw new Error('unknown Lab illuminant ' + name);
        }
        labConstants.labWhitePoint = name;
        labConstants.Xn = ill[0];
        labConstants.Zn = ill[1];
    }

    function getLabWhitePoint() {
        return labConstants.labWhitePoint;
    }

    var rgb2lab = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var rest = ref.slice(3);
        var ref$1 = rgb2xyz(r, g, b);
        var x = ref$1[0];
        var y = ref$1[1];
        var z = ref$1[2];
        var ref$2 = xyz2lab(x, y, z);
        var L = ref$2[0];
        var a = ref$2[1];
        var b_ = ref$2[2];
        return [L, a, b_ ].concat( (rest.length > 0 && rest[0] < 1 ? [rest[0]] : []));
    };

    function xyz2lab(x, y, z) {
        var Xn = labConstants.Xn;
        var Yn = labConstants.Yn;
        var Zn = labConstants.Zn;
        var kE = labConstants.kE;
        var kK = labConstants.kK;
        var xr = x / Xn;
        var yr = y / Yn;
        var zr = z / Zn;

        var fx = xr > kE ? Math.pow(xr, 1.0 / 3.0) : (kK * xr + 16.0) / 116.0;
        var fy = yr > kE ? Math.pow(yr, 1.0 / 3.0) : (kK * yr + 16.0) / 116.0;
        var fz = zr > kE ? Math.pow(zr, 1.0 / 3.0) : (kK * zr + 16.0) / 116.0;

        return [116.0 * fy - 16.0, 500.0 * (fx - fy), 200.0 * (fy - fz)];
    }

    function gammaAdjustSRGB(companded) {
        var sign = Math.sign(companded);
        companded = Math.abs(companded);
        var linear =
            companded <= 0.04045
                ? companded / 12.92
                : Math.pow((companded + 0.055) / 1.055, 2.4);
        return linear * sign;
    }

    var rgb2xyz = function (r, g, b) {
        // normalize and gamma adjust
        r = gammaAdjustSRGB(r / 255);
        g = gammaAdjustSRGB(g / 255);
        b = gammaAdjustSRGB(b / 255);

        var MtxRGB2XYZ = labConstants.MtxRGB2XYZ;
        var MtxAdaptMa = labConstants.MtxAdaptMa;
        var MtxAdaptMaI = labConstants.MtxAdaptMaI;
        var Xn = labConstants.Xn;
        var Yn = labConstants.Yn;
        var Zn = labConstants.Zn;
        var As = labConstants.As;
        var Bs = labConstants.Bs;
        var Cs = labConstants.Cs;

        var x = r * MtxRGB2XYZ.m00 + g * MtxRGB2XYZ.m10 + b * MtxRGB2XYZ.m20;
        var y = r * MtxRGB2XYZ.m01 + g * MtxRGB2XYZ.m11 + b * MtxRGB2XYZ.m21;
        var z = r * MtxRGB2XYZ.m02 + g * MtxRGB2XYZ.m12 + b * MtxRGB2XYZ.m22;

        var Ad = Xn * MtxAdaptMa.m00 + Yn * MtxAdaptMa.m10 + Zn * MtxAdaptMa.m20;
        var Bd = Xn * MtxAdaptMa.m01 + Yn * MtxAdaptMa.m11 + Zn * MtxAdaptMa.m21;
        var Cd = Xn * MtxAdaptMa.m02 + Yn * MtxAdaptMa.m12 + Zn * MtxAdaptMa.m22;

        var X = x * MtxAdaptMa.m00 + y * MtxAdaptMa.m10 + z * MtxAdaptMa.m20;
        var Y = x * MtxAdaptMa.m01 + y * MtxAdaptMa.m11 + z * MtxAdaptMa.m21;
        var Z = x * MtxAdaptMa.m02 + y * MtxAdaptMa.m12 + z * MtxAdaptMa.m22;

        X *= Ad / As;
        Y *= Bd / Bs;
        Z *= Cd / Cs;

        x = X * MtxAdaptMaI.m00 + Y * MtxAdaptMaI.m10 + Z * MtxAdaptMaI.m20;
        y = X * MtxAdaptMaI.m01 + Y * MtxAdaptMaI.m11 + Z * MtxAdaptMaI.m21;
        z = X * MtxAdaptMaI.m02 + Y * MtxAdaptMaI.m12 + Z * MtxAdaptMaI.m22;

        return [x, y, z];
    };

    /*
     * supported arguments:
     * - lab2css(l,a,b)
     * - lab2css(l,a,b,alpha)
     * - lab2css([l,a,b], mode)
     * - lab2css([l,a,b,alpha], mode)
     */
    var lch2css = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var lcha = unpack(args, 'lch');
        var mode = last(args) || 'lab';
        lcha[0] = rnd2(lcha[0]) + '%';
        lcha[1] = rnd2(lcha[1]);
        lcha[2] = isNaN(lcha[2]) ? 'none' : rnd2(lcha[2]) + 'deg'; // add deg unit to hue
        if (mode === 'lcha' || (lcha.length > 3 && lcha[3] < 1)) {
            lcha[3] = '/ ' + (lcha.length > 3 ? lcha[3] : 1);
        } else {
            lcha.length = 3;
        }
        return ("lch(" + (lcha.join(' ')) + ")");
    };

    var sqrt$4 = Math.sqrt;
    var atan2$2 = Math.atan2;
    var round$5 = Math.round;

    var lab2lch = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack(args, 'lab');
        var l = ref[0];
        var a = ref[1];
        var b = ref[2];
        var c = sqrt$4(a * a + b * b);
        var h = (atan2$2(b, a) * RAD2DEG + 360) % 360;
        if (round$5(c * 10000) === 0) { h = Number.NaN; }
        return [l, c, h];
    };

    var rgb2lch = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var rest = ref.slice(3);
        var ref$1 = rgb2lab(r, g, b);
        var l = ref$1[0];
        var a = ref$1[1];
        var b_ = ref$1[2];
        var ref$2 = lab2lch(l, a, b_);
        var L = ref$2[0];
        var c = ref$2[1];
        var h = ref$2[2];
        return [L, c, h ].concat( (rest.length > 0 && rest[0] < 1 ? [rest[0]] : []));
    };

    // from https://www.w3.org/TR/css-color-4/multiply-matrices.js
    function multiplyMatrices(A, B) {
        var m = A.length;

        if (!Array.isArray(A[0])) {
            // A is vector, convert to [[a, b, c, ...]]
            A = [A];
        }

        if (!Array.isArray(B[0])) {
            // B is vector, convert to [[a], [b], [c], ...]]
            B = B.map(function (x) { return [x]; });
        }

        var p = B[0].length;
        var B_cols = B[0].map(function (_, i) { return B.map(function (x) { return x[i]; }); }); // transpose B
        var product = A.map(function (row) { return B_cols.map(function (col) {
                if (!Array.isArray(row)) {
                    return col.reduce(function (a, c) { return a + c * row; }, 0);
                }

                return row.reduce(function (a, c, i) { return a + c * (col[i] || 0); }, 0);
            }); }
        );

        if (m === 1) {
            product = product[0]; // Avoid [[a, b, c, ...]]
        }

        if (p === 1) {
            return product.map(function (x) { return x[0]; }); // Avoid [[a], [b], [c], ...]]
        }

        return product;
    }

    var rgb2oklab = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var rest = ref.slice(3);
        var xyz = rgb2xyz(r, g, b);
        var oklab = XYZ_to_OKLab(xyz);
        return oklab.concat( (rest.length > 0 && rest[0] < 1 ? [rest[0]] : []));
    };

    // from https://www.w3.org/TR/css-color-4/#color-conversion-code
    function XYZ_to_OKLab(XYZ) {
        // Given XYZ relative to D65, convert to OKLab
        var XYZtoLMS = [
            [0.819022437996703, 0.3619062600528904, -0.1288737815209879],
            [0.0329836539323885, 0.9292868615863434, 0.0361446663506424],
            [0.0481771893596242, 0.2642395317527308, 0.6335478284694309]
        ];
        var LMStoOKLab = [
            [0.210454268309314, 0.7936177747023054, -0.0040720430116193],
            [1.9779985324311684, -2.4285922420485799, 0.450593709617411],
            [0.0259040424655478, 0.7827717124575296, -0.8086757549230774]
        ];

        var LMS = multiplyMatrices(XYZtoLMS, XYZ);
        // JavaScript Math.cbrt returns a sign-matched cube root
        // beware if porting to other languages
        // especially if tempted to use a general power function
        return multiplyMatrices(
            LMStoOKLab,
            LMS.map(function (c) { return Math.cbrt(c); })
        );
        // L in range [0,1]. For use in CSS, multiply by 100 and add a percent
    }

    var oklab2css = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var laba = unpack(args, 'lab');
        laba[0] = rnd2(laba[0] * 100) + '%';
        laba[1] = rnd3(laba[1]);
        laba[2] = rnd3(laba[2]);
        if (laba.length > 3 && laba[3] < 1) {
            laba[3] = '/ ' + (laba.length > 3 ? laba[3] : 1);
        } else {
            laba.length = 3;
        }
        return ("oklab(" + (laba.join(' ')) + ")");
    };

    var rgb2oklch = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var rest = ref.slice(3);
        var ref$1 = rgb2oklab(r, g, b);
        var l = ref$1[0];
        var a = ref$1[1];
        var b_ = ref$1[2];
        var ref$2 = lab2lch(l, a, b_);
        var L = ref$2[0];
        var c = ref$2[1];
        var h = ref$2[2];
        return [L, c, h ].concat( (rest.length > 0 && rest[0] < 1 ? [rest[0]] : []));
    };

    var oklch2css = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var lcha = unpack(args, 'lch');
        lcha[0] = rnd2(lcha[0] * 100) + '%';
        lcha[1] = rnd3(lcha[1]);
        lcha[2] = isNaN(lcha[2]) ? 'none' : rnd2(lcha[2]) + 'deg'; // add deg unit to hue
        if (lcha.length > 3 && lcha[3] < 1) {
            lcha[3] = '/ ' + (lcha.length > 3 ? lcha[3] : 1);
        } else {
            lcha.length = 3;
        }
        return ("oklch(" + (lcha.join(' ')) + ")");
    };

    var round$4 = Math.round;

    /*
     * supported arguments:
     * - rgb2css(r,g,b)
     * - rgb2css(r,g,b,a)
     * - rgb2css([r,g,b], mode)
     * - rgb2css([r,g,b,a], mode)
     * - rgb2css({r,g,b,a}, mode)
     */
    var rgb2css = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var rgba = unpack(args, 'rgba');
        var mode = last(args) || 'rgb';
        if (mode.substr(0, 3) === 'hsl') {
            return hsl2css(rgb2hsl$1(rgba), mode);
        }
        if (mode.substr(0, 3) === 'lab') {
            // change to D50 lab whitepoint since this is what W3C is using for CSS Lab colors
            var prevWhitePoint = getLabWhitePoint();
            setLabWhitePoint('d50');
            var cssColor = lab2css(rgb2lab(rgba), mode);
            setLabWhitePoint(prevWhitePoint);
            return cssColor;
        }
        if (mode.substr(0, 3) === 'lch') {
            // change to D50 lab whitepoint since this is what W3C is using for CSS Lab colors
            var prevWhitePoint$1 = getLabWhitePoint();
            setLabWhitePoint('d50');
            var cssColor$1 = lch2css(rgb2lch(rgba), mode);
            setLabWhitePoint(prevWhitePoint$1);
            return cssColor$1;
        }
        if (mode.substr(0, 5) === 'oklab') {
            return oklab2css(rgb2oklab(rgba));
        }
        if (mode.substr(0, 5) === 'oklch') {
            return oklch2css(rgb2oklch(rgba));
        }
        rgba[0] = round$4(rgba[0]);
        rgba[1] = round$4(rgba[1]);
        rgba[2] = round$4(rgba[2]);
        if (mode === 'rgba' || (rgba.length > 3 && rgba[3] < 1)) {
            rgba[3] = '/ ' + (rgba.length > 3 ? rgba[3] : 1);
            mode = 'rgba';
        }
        return ((mode.substr(0, 3)) + "(" + (rgba.slice(0, mode === 'rgb' ? 3 : 4).join(' ')) + ")");
    };

    var hsl2rgb = function () {
        var assign;

        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];
        args = unpack(args, 'hsl');
        var h = args[0];
        var s = args[1];
        var l = args[2];
        var r, g, b;
        if (s === 0) {
            r = g = b = l * 255;
        } else {
            var t3 = [0, 0, 0];
            var c = [0, 0, 0];
            var t2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var t1 = 2 * l - t2;
            var h_ = h / 360;
            t3[0] = h_ + 1 / 3;
            t3[1] = h_;
            t3[2] = h_ - 1 / 3;
            for (var i = 0; i < 3; i++) {
                if (t3[i] < 0) { t3[i] += 1; }
                if (t3[i] > 1) { t3[i] -= 1; }
                if (6 * t3[i] < 1) { c[i] = t1 + (t2 - t1) * 6 * t3[i]; }
                else if (2 * t3[i] < 1) { c[i] = t2; }
                else if (3 * t3[i] < 2) { c[i] = t1 + (t2 - t1) * (2 / 3 - t3[i]) * 6; }
                else { c[i] = t1; }
            }
            (assign = [c[0] * 255, c[1] * 255, c[2] * 255], r = assign[0], g = assign[1], b = assign[2]);
        }
        if (args.length > 3) {
            // keep alpha channel
            return [r, g, b, args[3]];
        }
        return [r, g, b, 1];
    };

    /*
     * L* [0..100]
     * a [-100..100]
     * b [-100..100]
     */
    var lab2rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack(args, 'lab');
        var L = args[0];
        var a = args[1];
        var b = args[2];
        var ref = lab2xyz(L, a, b);
        var x = ref[0];
        var y = ref[1];
        var z = ref[2];
        var ref$1 = xyz2rgb(x, y, z);
        var r = ref$1[0];
        var g = ref$1[1];
        var b_ = ref$1[2];
        return [r, g, b_, args.length > 3 ? args[3] : 1];
    };

    var lab2xyz = function (L, a, b) {
        var kE = labConstants.kE;
        var kK = labConstants.kK;
        var kKE = labConstants.kKE;
        var Xn = labConstants.Xn;
        var Yn = labConstants.Yn;
        var Zn = labConstants.Zn;

        var fy = (L + 16.0) / 116.0;
        var fx = 0.002 * a + fy;
        var fz = fy - 0.005 * b;

        var fx3 = fx * fx * fx;
        var fz3 = fz * fz * fz;

        var xr = fx3 > kE ? fx3 : (116.0 * fx - 16.0) / kK;
        var yr = L > kKE ? Math.pow((L + 16.0) / 116.0, 3.0) : L / kK;
        var zr = fz3 > kE ? fz3 : (116.0 * fz - 16.0) / kK;

        var x = xr * Xn;
        var y = yr * Yn;
        var z = zr * Zn;

        return [x, y, z];
    };

    var compand = function (linear) {
        /* sRGB */
        var sign = Math.sign(linear);
        linear = Math.abs(linear);
        return (
            (linear <= 0.0031308
                ? linear * 12.92
                : 1.055 * Math.pow(linear, 1.0 / 2.4) - 0.055) * sign
        );
    };

    var xyz2rgb = function (x, y, z) {
        var MtxAdaptMa = labConstants.MtxAdaptMa;
        var MtxAdaptMaI = labConstants.MtxAdaptMaI;
        var MtxXYZ2RGB = labConstants.MtxXYZ2RGB;
        var RefWhiteRGB = labConstants.RefWhiteRGB;
        var Xn = labConstants.Xn;
        var Yn = labConstants.Yn;
        var Zn = labConstants.Zn;

        var As = Xn * MtxAdaptMa.m00 + Yn * MtxAdaptMa.m10 + Zn * MtxAdaptMa.m20;
        var Bs = Xn * MtxAdaptMa.m01 + Yn * MtxAdaptMa.m11 + Zn * MtxAdaptMa.m21;
        var Cs = Xn * MtxAdaptMa.m02 + Yn * MtxAdaptMa.m12 + Zn * MtxAdaptMa.m22;

        var Ad =
            RefWhiteRGB.X * MtxAdaptMa.m00 +
            RefWhiteRGB.Y * MtxAdaptMa.m10 +
            RefWhiteRGB.Z * MtxAdaptMa.m20;
        var Bd =
            RefWhiteRGB.X * MtxAdaptMa.m01 +
            RefWhiteRGB.Y * MtxAdaptMa.m11 +
            RefWhiteRGB.Z * MtxAdaptMa.m21;
        var Cd =
            RefWhiteRGB.X * MtxAdaptMa.m02 +
            RefWhiteRGB.Y * MtxAdaptMa.m12 +
            RefWhiteRGB.Z * MtxAdaptMa.m22;

        var X1 =
            (x * MtxAdaptMa.m00 + y * MtxAdaptMa.m10 + z * MtxAdaptMa.m20) *
            (Ad / As);
        var Y1 =
            (x * MtxAdaptMa.m01 + y * MtxAdaptMa.m11 + z * MtxAdaptMa.m21) *
            (Bd / Bs);
        var Z1 =
            (x * MtxAdaptMa.m02 + y * MtxAdaptMa.m12 + z * MtxAdaptMa.m22) *
            (Cd / Cs);

        var X2 =
            X1 * MtxAdaptMaI.m00 + Y1 * MtxAdaptMaI.m10 + Z1 * MtxAdaptMaI.m20;
        var Y2 =
            X1 * MtxAdaptMaI.m01 + Y1 * MtxAdaptMaI.m11 + Z1 * MtxAdaptMaI.m21;
        var Z2 =
            X1 * MtxAdaptMaI.m02 + Y1 * MtxAdaptMaI.m12 + Z1 * MtxAdaptMaI.m22;

        var r = compand(
            X2 * MtxXYZ2RGB.m00 + Y2 * MtxXYZ2RGB.m10 + Z2 * MtxXYZ2RGB.m20
        );
        var g = compand(
            X2 * MtxXYZ2RGB.m01 + Y2 * MtxXYZ2RGB.m11 + Z2 * MtxXYZ2RGB.m21
        );
        var b = compand(
            X2 * MtxXYZ2RGB.m02 + Y2 * MtxXYZ2RGB.m12 + Z2 * MtxXYZ2RGB.m22
        );

        return [r * 255, g * 255, b * 255];
    };

    var sin$3 = Math.sin;
    var cos$4 = Math.cos;

    var lch2lab = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        /*
        Convert from a qualitative parameter h and a quantitative parameter l to a 24-bit pixel.
        These formulas were invented by David Dalrymple to obtain maximum contrast without going
        out of gamut if the parameters are in the range 0-1.

        A saturation multiplier was added by Gregor Aisch
        */
        var ref = unpack(args, 'lch');
        var l = ref[0];
        var c = ref[1];
        var h = ref[2];
        if (isNaN(h)) { h = 0; }
        h = h * DEG2RAD;
        return [l, cos$4(h) * c, sin$3(h) * c];
    };

    var lch2rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack(args, 'lch');
        var l = args[0];
        var c = args[1];
        var h = args[2];
        var ref = lch2lab(l, c, h);
        var L = ref[0];
        var a = ref[1];
        var b_ = ref[2];
        var ref$1 = lab2rgb(L, a, b_);
        var r = ref$1[0];
        var g = ref$1[1];
        var b = ref$1[2];
        return [r, g, b, args.length > 3 ? args[3] : 1];
    };

    var oklab2rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack(args, 'lab');
        var L = args[0];
        var a = args[1];
        var b = args[2];
        var rest = args.slice(3);
        var ref = OKLab_to_XYZ([L, a, b]);
        var X = ref[0];
        var Y = ref[1];
        var Z = ref[2];
        var ref$1 = xyz2rgb(X, Y, Z);
        var r = ref$1[0];
        var g = ref$1[1];
        var b_ = ref$1[2];
        return [r, g, b_ ].concat( (rest.length > 0 && rest[0] < 1 ? [rest[0]] : []));
    };

    // from https://www.w3.org/TR/css-color-4/#color-conversion-code
    function OKLab_to_XYZ(OKLab) {
        // Given OKLab, convert to XYZ relative to D65
        var LMStoXYZ = [
            [1.2268798758459243, -0.5578149944602171, 0.2813910456659647],
            [-0.0405757452148008, 1.112286803280317, -0.0717110580655164],
            [-0.0763729366746601, -0.4214933324022432, 1.5869240198367816]
        ];
        var OKLabtoLMS = [
            [1.0, 0.3963377773761749, 0.2158037573099136],
            [1.0, -0.1055613458156586, -0.0638541728258133],
            [1.0, -0.0894841775298119, -1.2914855480194092]
        ];

        var LMSnl = multiplyMatrices(OKLabtoLMS, OKLab);
        return multiplyMatrices(
            LMStoXYZ,
            LMSnl.map(function (c) { return Math.pow( c, 3 ); })
        );
    }

    var oklch2rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack(args, 'lch');
        var l = args[0];
        var c = args[1];
        var h = args[2];
        var rest = args.slice(3);
        var ref = lch2lab(l, c, h);
        var L = ref[0];
        var a = ref[1];
        var b_ = ref[2];
        var ref$1 = oklab2rgb(L, a, b_);
        var r = ref$1[0];
        var g = ref$1[1];
        var b = ref$1[2];
        return [r, g, b ].concat( (rest.length > 0 && rest[0] < 1 ? [rest[0]] : []));
    };

    var INT_OR_PCT = /((?:-?\d+)|(?:-?\d+(?:\.\d+)?)%|none)/.source;
    var FLOAT_OR_PCT = /((?:-?(?:\d+(?:\.\d*)?|\.\d+)%?)|none)/.source;
    var PCT = /((?:-?(?:\d+(?:\.\d*)?|\.\d+)%)|none)/.source;
    var RE_S = /\s*/.source;
    var SEP = /\s+/.source;
    var COMMA = /\s*,\s*/.source;
    var ANLGE = /((?:-?(?:\d+(?:\.\d*)?|\.\d+)(?:deg)?)|none)/.source;
    var ALPHA = /\s*(?:\/\s*((?:[01]|[01]?\.\d+)|\d+(?:\.\d+)?%))?/.source;

    // e.g. rgb(250 20 0), rgb(100% 50% 20%), rgb(100% 50% 20% / 0.5)
    var RE_RGB = new RegExp(
        '^rgba?\\(' +
            RE_S +
            [INT_OR_PCT, INT_OR_PCT, INT_OR_PCT].join(SEP) +
            ALPHA +
            '\\)$'
    );
    var RE_RGB_LEGACY = new RegExp(
        '^rgb\\(' +
            RE_S +
            [INT_OR_PCT, INT_OR_PCT, INT_OR_PCT].join(COMMA) +
            RE_S +
            '\\)$'
    );
    var RE_RGBA_LEGACY = new RegExp(
        '^rgba\\(' +
            RE_S +
            [INT_OR_PCT, INT_OR_PCT, INT_OR_PCT, FLOAT_OR_PCT].join(COMMA) +
            RE_S +
            '\\)$'
    );

    var RE_HSL = new RegExp(
        '^hsla?\\(' + RE_S + [ANLGE, PCT, PCT].join(SEP) + ALPHA + '\\)$'
    );
    var RE_HSL_LEGACY = new RegExp(
        '^hsl?\\(' + RE_S + [ANLGE, PCT, PCT].join(COMMA) + RE_S + '\\)$'
    );
    var RE_HSLA_LEGACY =
        /^hsla\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/;

    var RE_LAB = new RegExp(
        '^lab\\(' +
            RE_S +
            [FLOAT_OR_PCT, FLOAT_OR_PCT, FLOAT_OR_PCT].join(SEP) +
            ALPHA +
            '\\)$'
    );
    var RE_LCH = new RegExp(
        '^lch\\(' +
            RE_S +
            [FLOAT_OR_PCT, FLOAT_OR_PCT, ANLGE].join(SEP) +
            ALPHA +
            '\\)$'
    );
    var RE_OKLAB = new RegExp(
        '^oklab\\(' +
            RE_S +
            [FLOAT_OR_PCT, FLOAT_OR_PCT, FLOAT_OR_PCT].join(SEP) +
            ALPHA +
            '\\)$'
    );
    var RE_OKLCH = new RegExp(
        '^oklch\\(' +
            RE_S +
            [FLOAT_OR_PCT, FLOAT_OR_PCT, ANLGE].join(SEP) +
            ALPHA +
            '\\)$'
    );

    var round$3 = Math.round;

    var roundRGB = function (rgb) {
        return rgb.map(function (v, i) { return (i <= 2 ? limit(round$3(v), 0, 255) : v); });
    };

    var percentToAbsolute = function (pct, min, max, signed) {
        if ( min === void 0 ) min = 0;
        if ( max === void 0 ) max = 100;
        if ( signed === void 0 ) signed = false;

        if (typeof pct === 'string' && pct.endsWith('%')) {
            pct = parseFloat(pct.substring(0, pct.length - 1)) / 100;
            if (signed) {
                // signed percentages are in the range -100% to 100%
                pct = min + (pct + 1) * 0.5 * (max - min);
            } else {
                pct = min + pct * (max - min);
            }
        }
        return +pct;
    };

    var noneToValue = function (v, noneValue) {
        return v === 'none' ? noneValue : v;
    };

    var css2rgb = function (css) {
        css = css.toLowerCase().trim();

        if (css === 'transparent') {
            return [0, 0, 0, 0];
        }

        var m;

        if (input.format.named) {
            try {
                return input.format.named(css);
                // eslint-disable-next-line
            } catch (e) {}
        }

        // rgb(250 20 0) or rgb(250,20,0)
        if ((m = css.match(RE_RGB)) || (m = css.match(RE_RGB_LEGACY))) {
            var rgb = m.slice(1, 4);
            for (var i = 0; i < 3; i++) {
                rgb[i] = +percentToAbsolute(noneToValue(rgb[i], 0), 0, 255);
            }
            rgb = roundRGB(rgb);
            var alpha = m[4] !== undefined ? +percentToAbsolute(m[4], 0, 1) : 1;
            rgb[3] = alpha; // default alpha
            return rgb;
        }

        // rgba(250,20,0,0.4)
        if ((m = css.match(RE_RGBA_LEGACY))) {
            var rgb$1 = m.slice(1, 5);
            for (var i$1 = 0; i$1 < 4; i$1++) {
                rgb$1[i$1] = +percentToAbsolute(rgb$1[i$1], 0, 255);
            }
            return rgb$1;
        }

        // hsl(0,100%,50%)
        if ((m = css.match(RE_HSL)) || (m = css.match(RE_HSL_LEGACY))) {
            var hsl = m.slice(1, 4);
            hsl[0] = +noneToValue(hsl[0].replace('deg', ''), 0);
            hsl[1] = +percentToAbsolute(noneToValue(hsl[1], 0), 0, 100) * 0.01;
            hsl[2] = +percentToAbsolute(noneToValue(hsl[2], 0), 0, 100) * 0.01;
            var rgb$2 = roundRGB(hsl2rgb(hsl));
            var alpha$1 = m[4] !== undefined ? +percentToAbsolute(m[4], 0, 1) : 1;
            rgb$2[3] = alpha$1;
            return rgb$2;
        }

        // hsla(0,100%,50%,0.5)
        if ((m = css.match(RE_HSLA_LEGACY))) {
            var hsl$1 = m.slice(1, 4);
            hsl$1[1] *= 0.01;
            hsl$1[2] *= 0.01;
            var rgb$3 = hsl2rgb(hsl$1);
            for (var i$2 = 0; i$2 < 3; i$2++) {
                rgb$3[i$2] = round$3(rgb$3[i$2]);
            }
            rgb$3[3] = +m[4]; // default alpha = 1
            return rgb$3;
        }

        if ((m = css.match(RE_LAB))) {
            var lab = m.slice(1, 4);
            lab[0] = percentToAbsolute(noneToValue(lab[0], 0), 0, 100);
            lab[1] = percentToAbsolute(noneToValue(lab[1], 0), -125, 125, true);
            lab[2] = percentToAbsolute(noneToValue(lab[2], 0), -125, 125, true);
            // convert to D50 Lab whitepoint
            var wp = getLabWhitePoint();
            setLabWhitePoint('d50');
            var rgb$4 = roundRGB(lab2rgb(lab));
            // convert back to original Lab whitepoint
            setLabWhitePoint(wp);
            var alpha$2 = m[4] !== undefined ? +percentToAbsolute(m[4], 0, 1) : 1;
            rgb$4[3] = alpha$2;
            return rgb$4;
        }

        if ((m = css.match(RE_LCH))) {
            var lch = m.slice(1, 4);
            lch[0] = percentToAbsolute(lch[0], 0, 100);
            lch[1] = percentToAbsolute(noneToValue(lch[1], 0), 0, 150, false);
            lch[2] = +noneToValue(lch[2].replace('deg', ''), 0);
            // convert to D50 Lab whitepoint
            var wp$1 = getLabWhitePoint();
            setLabWhitePoint('d50');
            var rgb$5 = roundRGB(lch2rgb(lch));
            // convert back to original Lab whitepoint
            setLabWhitePoint(wp$1);
            var alpha$3 = m[4] !== undefined ? +percentToAbsolute(m[4], 0, 1) : 1;
            rgb$5[3] = alpha$3;
            return rgb$5;
        }

        if ((m = css.match(RE_OKLAB))) {
            var oklab = m.slice(1, 4);
            oklab[0] = percentToAbsolute(noneToValue(oklab[0], 0), 0, 1);
            oklab[1] = percentToAbsolute(noneToValue(oklab[1], 0), -0.4, 0.4, true);
            oklab[2] = percentToAbsolute(noneToValue(oklab[2], 0), -0.4, 0.4, true);
            var rgb$6 = roundRGB(oklab2rgb(oklab));
            var alpha$4 = m[4] !== undefined ? +percentToAbsolute(m[4], 0, 1) : 1;
            rgb$6[3] = alpha$4;
            return rgb$6;
        }

        if ((m = css.match(RE_OKLCH))) {
            var oklch = m.slice(1, 4);
            oklch[0] = percentToAbsolute(noneToValue(oklch[0], 0), 0, 1);
            oklch[1] = percentToAbsolute(noneToValue(oklch[1], 0), 0, 0.4, false);
            oklch[2] = +noneToValue(oklch[2].replace('deg', ''), 0);
            var rgb$7 = roundRGB(oklch2rgb(oklch));
            var alpha$5 = m[4] !== undefined ? +percentToAbsolute(m[4], 0, 1) : 1;
            rgb$7[3] = alpha$5;
            return rgb$7;
        }
    };

    css2rgb.test = function (s) {
        return (
            // modern
            RE_RGB.test(s) ||
            RE_HSL.test(s) ||
            RE_LAB.test(s) ||
            RE_LCH.test(s) ||
            RE_OKLAB.test(s) ||
            RE_OKLCH.test(s) ||
            // legacy
            RE_RGB_LEGACY.test(s) ||
            RE_RGBA_LEGACY.test(s) ||
            RE_HSL_LEGACY.test(s) ||
            RE_HSLA_LEGACY.test(s) ||
            s === 'transparent'
        );
    };

    Color.prototype.css = function (mode) {
        return rgb2css(this._rgb, mode);
    };

    var css = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color, [ null ].concat( args, ['css']) ));
    };
    chroma.css = css;

    input.format.css = css2rgb;

    input.autodetect.push({
        p: 5,
        test: function (h) {
            var rest = [], len = arguments.length - 1;
            while ( len-- > 0 ) rest[ len ] = arguments[ len + 1 ];

            if (!rest.length && type(h) === 'string' && css2rgb.test(h)) {
                return 'css';
            }
        }
    });

    input.format.gl = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var rgb = unpack(args, 'rgba');
        rgb[0] *= 255;
        rgb[1] *= 255;
        rgb[2] *= 255;
        return rgb;
    };

    var gl = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color, [ null ].concat( args, ['gl']) ));
    };
    chroma.gl = gl;

    Color.prototype.gl = function () {
        var rgb = this._rgb;
        return [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, rgb[3]];
    };

    var floor$3 = Math.floor;

    /*
     * this is basically just HSV with some minor tweaks
     *
     * hue.. [0..360]
     * chroma .. [0..1]
     * grayness .. [0..1]
     */

    var hcg2rgb = function () {
        var assign, assign$1, assign$2, assign$3, assign$4, assign$5;

        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];
        args = unpack(args, 'hcg');
        var h = args[0];
        var c = args[1];
        var _g = args[2];
        var r, g, b;
        _g = _g * 255;
        var _c = c * 255;
        if (c === 0) {
            r = g = b = _g;
        } else {
            if (h === 360) { h = 0; }
            if (h > 360) { h -= 360; }
            if (h < 0) { h += 360; }
            h /= 60;
            var i = floor$3(h);
            var f = h - i;
            var p = _g * (1 - c);
            var q = p + _c * (1 - f);
            var t = p + _c * f;
            var v = p + _c;
            switch (i) {
                case 0:
                    (assign = [v, t, p], r = assign[0], g = assign[1], b = assign[2]);
                    break;
                case 1:
                    (assign$1 = [q, v, p], r = assign$1[0], g = assign$1[1], b = assign$1[2]);
                    break;
                case 2:
                    (assign$2 = [p, v, t], r = assign$2[0], g = assign$2[1], b = assign$2[2]);
                    break;
                case 3:
                    (assign$3 = [p, q, v], r = assign$3[0], g = assign$3[1], b = assign$3[2]);
                    break;
                case 4:
                    (assign$4 = [t, p, v], r = assign$4[0], g = assign$4[1], b = assign$4[2]);
                    break;
                case 5:
                    (assign$5 = [v, p, q], r = assign$5[0], g = assign$5[1], b = assign$5[2]);
                    break;
            }
        }
        return [r, g, b, args.length > 3 ? args[3] : 1];
    };

    var rgb2hcg = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var minRgb = min$3(r, g, b);
        var maxRgb = max$3(r, g, b);
        var delta = maxRgb - minRgb;
        var c = (delta * 100) / 255;
        var _g = (minRgb / (255 - delta)) * 100;
        var h;
        if (delta === 0) {
            h = Number.NaN;
        } else {
            if (r === maxRgb) { h = (g - b) / delta; }
            if (g === maxRgb) { h = 2 + (b - r) / delta; }
            if (b === maxRgb) { h = 4 + (r - g) / delta; }
            h *= 60;
            if (h < 0) { h += 360; }
        }
        return [h, c, _g];
    };

    Color.prototype.hcg = function () {
        return rgb2hcg(this._rgb);
    };

    var hcg$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color, [ null ].concat( args, ['hcg']) ));
    };
    chroma.hcg = hcg$1;

    input.format.hcg = hcg2rgb;

    input.autodetect.push({
        p: 1,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack(args, 'hcg');
            if (type(args) === 'array' && args.length === 3) {
                return 'hcg';
            }
        }
    });

    var RE_HEX = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    var RE_HEXA = /^#?([A-Fa-f0-9]{8}|[A-Fa-f0-9]{4})$/;

    var hex2rgb = function (hex) {
        if (hex.match(RE_HEX)) {
            // remove optional leading #
            if (hex.length === 4 || hex.length === 7) {
                hex = hex.substr(1);
            }
            // expand short-notation to full six-digit
            if (hex.length === 3) {
                hex = hex.split('');
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            var u = parseInt(hex, 16);
            var r = u >> 16;
            var g = (u >> 8) & 0xff;
            var b = u & 0xff;
            return [r, g, b, 1];
        }

        // match rgba hex format, eg #FF000077
        if (hex.match(RE_HEXA)) {
            if (hex.length === 5 || hex.length === 9) {
                // remove optional leading #
                hex = hex.substr(1);
            }
            // expand short-notation to full eight-digit
            if (hex.length === 4) {
                hex = hex.split('');
                hex =
                    hex[0] +
                    hex[0] +
                    hex[1] +
                    hex[1] +
                    hex[2] +
                    hex[2] +
                    hex[3] +
                    hex[3];
            }
            var u$1 = parseInt(hex, 16);
            var r$1 = (u$1 >> 24) & 0xff;
            var g$1 = (u$1 >> 16) & 0xff;
            var b$1 = (u$1 >> 8) & 0xff;
            var a = Math.round(((u$1 & 0xff) / 0xff) * 100) / 100;
            return [r$1, g$1, b$1, a];
        }

        // we used to check for css colors here
        // if _input.css? and rgb = _input.css hex
        //     return rgb

        throw new Error(("unknown hex color: " + hex));
    };

    var round$2 = Math.round;

    var rgb2hex = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack(args, 'rgba');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var a = ref[3];
        var mode = last(args) || 'auto';
        if (a === undefined) { a = 1; }
        if (mode === 'auto') {
            mode = a < 1 ? 'rgba' : 'rgb';
        }
        r = round$2(r);
        g = round$2(g);
        b = round$2(b);
        var u = (r << 16) | (g << 8) | b;
        var str = '000000' + u.toString(16); //#.toUpperCase();
        str = str.substr(str.length - 6);
        var hxa = '0' + round$2(a * 255).toString(16);
        hxa = hxa.substr(hxa.length - 2);
        switch (mode.toLowerCase()) {
            case 'rgba':
                return ("#" + str + hxa);
            case 'argb':
                return ("#" + hxa + str);
            default:
                return ("#" + str);
        }
    };

    Color.prototype.hex = function (mode) {
        return rgb2hex(this._rgb, mode);
    };

    var hex = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color, [ null ].concat( args, ['hex']) ));
    };
    chroma.hex = hex;

    input.format.hex = hex2rgb;
    input.autodetect.push({
        p: 4,
        test: function (h) {
            var rest = [], len = arguments.length - 1;
            while ( len-- > 0 ) rest[ len ] = arguments[ len + 1 ];

            if (
                !rest.length &&
                type(h) === 'string' &&
                [3, 4, 5, 6, 7, 8, 9].indexOf(h.length) >= 0
            ) {
                return 'hex';
            }
        }
    });

    var cos$3 = Math.cos;

    /*
     * hue [0..360]
     * saturation [0..1]
     * intensity [0..1]
     */
    var hsi2rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        /*
        borrowed from here:
        http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/hsi2rgb.cpp
        */
        args = unpack(args, 'hsi');
        var h = args[0];
        var s = args[1];
        var i = args[2];
        var r, g, b;

        if (isNaN(h)) { h = 0; }
        if (isNaN(s)) { s = 0; }
        // normalize hue
        if (h > 360) { h -= 360; }
        if (h < 0) { h += 360; }
        h /= 360;
        if (h < 1 / 3) {
            b = (1 - s) / 3;
            r = (1 + (s * cos$3(TWOPI * h)) / cos$3(PITHIRD - TWOPI * h)) / 3;
            g = 1 - (b + r);
        } else if (h < 2 / 3) {
            h -= 1 / 3;
            r = (1 - s) / 3;
            g = (1 + (s * cos$3(TWOPI * h)) / cos$3(PITHIRD - TWOPI * h)) / 3;
            b = 1 - (r + g);
        } else {
            h -= 2 / 3;
            g = (1 - s) / 3;
            b = (1 + (s * cos$3(TWOPI * h)) / cos$3(PITHIRD - TWOPI * h)) / 3;
            r = 1 - (g + b);
        }
        r = limit(i * r * 3);
        g = limit(i * g * 3);
        b = limit(i * b * 3);
        return [r * 255, g * 255, b * 255, args.length > 3 ? args[3] : 1];
    };

    var min$2 = Math.min;
    var sqrt$3 = Math.sqrt;
    var acos = Math.acos;

    var rgb2hsi = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        /*
        borrowed from here:
        http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/rgb2hsi.cpp
        */
        var ref = unpack(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        r /= 255;
        g /= 255;
        b /= 255;
        var h;
        var min_ = min$2(r, g, b);
        var i = (r + g + b) / 3;
        var s = i > 0 ? 1 - min_ / i : 0;
        if (s === 0) {
            h = NaN;
        } else {
            h = (r - g + (r - b)) / 2;
            h /= sqrt$3((r - g) * (r - g) + (r - b) * (g - b));
            h = acos(h);
            if (b > g) {
                h = TWOPI - h;
            }
            h /= TWOPI;
        }
        return [h * 360, s, i];
    };

    Color.prototype.hsi = function () {
        return rgb2hsi(this._rgb);
    };

    var hsi$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color, [ null ].concat( args, ['hsi']) ));
    };
    chroma.hsi = hsi$1;

    input.format.hsi = hsi2rgb;

    input.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack(args, 'hsi');
            if (type(args) === 'array' && args.length === 3) {
                return 'hsi';
            }
        }
    });

    Color.prototype.hsl = function () {
        return rgb2hsl$1(this._rgb);
    };

    var hsl$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color, [ null ].concat( args, ['hsl']) ));
    };
    chroma.hsl = hsl$1;

    input.format.hsl = hsl2rgb;

    input.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack(args, 'hsl');
            if (type(args) === 'array' && args.length === 3) {
                return 'hsl';
            }
        }
    });

    var floor$2 = Math.floor;

    var hsv2rgb = function () {
        var assign, assign$1, assign$2, assign$3, assign$4, assign$5;

        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];
        args = unpack(args, 'hsv');
        var h = args[0];
        var s = args[1];
        var v = args[2];
        var r, g, b;
        v *= 255;
        if (s === 0) {
            r = g = b = v;
        } else {
            if (h === 360) { h = 0; }
            if (h > 360) { h -= 360; }
            if (h < 0) { h += 360; }
            h /= 60;

            var i = floor$2(h);
            var f = h - i;
            var p = v * (1 - s);
            var q = v * (1 - s * f);
            var t = v * (1 - s * (1 - f));

            switch (i) {
                case 0:
                    (assign = [v, t, p], r = assign[0], g = assign[1], b = assign[2]);
                    break;
                case 1:
                    (assign$1 = [q, v, p], r = assign$1[0], g = assign$1[1], b = assign$1[2]);
                    break;
                case 2:
                    (assign$2 = [p, v, t], r = assign$2[0], g = assign$2[1], b = assign$2[2]);
                    break;
                case 3:
                    (assign$3 = [p, q, v], r = assign$3[0], g = assign$3[1], b = assign$3[2]);
                    break;
                case 4:
                    (assign$4 = [t, p, v], r = assign$4[0], g = assign$4[1], b = assign$4[2]);
                    break;
                case 5:
                    (assign$5 = [v, p, q], r = assign$5[0], g = assign$5[1], b = assign$5[2]);
                    break;
            }
        }
        return [r, g, b, args.length > 3 ? args[3] : 1];
    };

    var min$1 = Math.min;
    var max$1 = Math.max;

    /*
     * supported arguments:
     * - rgb2hsv(r,g,b)
     * - rgb2hsv([r,g,b])
     * - rgb2hsv({r,g,b})
     */
    var rgb2hsl = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack(args, 'rgb');
        var r = args[0];
        var g = args[1];
        var b = args[2];
        var min_ = min$1(r, g, b);
        var max_ = max$1(r, g, b);
        var delta = max_ - min_;
        var h, s, v;
        v = max_ / 255.0;
        if (max_ === 0) {
            h = Number.NaN;
            s = 0;
        } else {
            s = delta / max_;
            if (r === max_) { h = (g - b) / delta; }
            if (g === max_) { h = 2 + (b - r) / delta; }
            if (b === max_) { h = 4 + (r - g) / delta; }
            h *= 60;
            if (h < 0) { h += 360; }
        }
        return [h, s, v];
    };

    Color.prototype.hsv = function () {
        return rgb2hsl(this._rgb);
    };

    var hsv$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color, [ null ].concat( args, ['hsv']) ));
    };
    chroma.hsv = hsv$1;

    input.format.hsv = hsv2rgb;

    input.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack(args, 'hsv');
            if (type(args) === 'array' && args.length === 3) {
                return 'hsv';
            }
        }
    });

    Color.prototype.lab = function () {
        return rgb2lab(this._rgb);
    };

    var lab$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color, [ null ].concat( args, ['lab']) ));
    };
    Object.assign(chroma, { lab: lab$1, getLabWhitePoint: getLabWhitePoint, setLabWhitePoint: setLabWhitePoint });

    input.format.lab = lab2rgb;

    input.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack(args, 'lab');
            if (type(args) === 'array' && args.length === 3) {
                return 'lab';
            }
        }
    });

    var hcl2rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var hcl = reverse3(unpack(args, 'hcl'));
        return lch2rgb.apply(void 0, hcl);
    };

    Color.prototype.lch = function () {
        return rgb2lch(this._rgb);
    };
    Color.prototype.hcl = function () {
        return reverse3(rgb2lch(this._rgb));
    };

    var lch$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color, [ null ].concat( args, ['lch']) ));
    };
    var hcl = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color, [ null ].concat( args, ['hcl']) ));
    };

    Object.assign(chroma, { lch: lch$1, hcl: hcl });

    input.format.lch = lch2rgb;
    input.format.hcl = hcl2rgb;
    ['lch', 'hcl'].forEach(function (m) { return input.autodetect.push({
            p: 2,
            test: function () {
                var args = [], len = arguments.length;
                while ( len-- ) args[ len ] = arguments[ len ];

                args = unpack(args, m);
                if (type(args) === 'array' && args.length === 3) {
                    return m;
                }
            }
        }); }
    );

    var num2rgb = function (num) {
        if (type(num) == 'number' && num >= 0 && num <= 0xffffff) {
            var r = num >> 16;
            var g = (num >> 8) & 0xff;
            var b = num & 0xff;
            return [r, g, b, 1];
        }
        throw new Error('unknown num color: ' + num);
    };

    var rgb2num = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        return (r << 16) + (g << 8) + b;
    };

    Color.prototype.num = function () {
        return rgb2num(this._rgb);
    };

    var num$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color, [ null ].concat( args, ['num']) ));
    };

    Object.assign(chroma, { num: num$1 });

    input.format.num = num2rgb;

    input.autodetect.push({
        p: 5,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            if (
                args.length === 1 &&
                type(args[0]) === 'number' &&
                args[0] >= 0 &&
                args[0] <= 0xffffff
            ) {
                return 'num';
            }
        }
    });

    var round$1 = Math.round;

    Color.prototype.rgb = function (rnd) {
        if ( rnd === void 0 ) rnd = true;

        if (rnd === false) { return this._rgb.slice(0, 3); }
        return this._rgb.slice(0, 3).map(round$1);
    };

    Color.prototype.rgba = function (rnd) {
        if ( rnd === void 0 ) rnd = true;

        return this._rgb.slice(0, 4).map(function (v, i) {
            return i < 3 ? (rnd === false ? v : round$1(v)) : v;
        });
    };

    var rgb$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color, [ null ].concat( args, ['rgb']) ));
    };
    Object.assign(chroma, { rgb: rgb$1 });

    input.format.rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var rgba = unpack(args, 'rgba');
        if (rgba[3] === undefined) { rgba[3] = 1; }
        return rgba;
    };

    input.autodetect.push({
        p: 3,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack(args, 'rgba');
            if (
                type(args) === 'array' &&
                (args.length === 3 ||
                    (args.length === 4 &&
                        type(args[3]) == 'number' &&
                        args[3] >= 0 &&
                        args[3] <= 1))
            ) {
                return 'rgb';
            }
        }
    });

    /*
     * Based on implementation by Neil Bartlett
     * https://github.com/neilbartlett/color-temperature
     */

    var log$1 = Math.log;

    var temperature2rgb = function (kelvin) {
        var temp = kelvin / 100;
        var r, g, b;
        if (temp < 66) {
            r = 255;
            g =
                temp < 6
                    ? 0
                    : -155.25485562709179 -
                      0.44596950469579133 * (g = temp - 2) +
                      104.49216199393888 * log$1(g);
            b =
                temp < 20
                    ? 0
                    : -254.76935184120902 +
                      0.8274096064007395 * (b = temp - 10) +
                      115.67994401066147 * log$1(b);
        } else {
            r =
                351.97690566805693 +
                0.114206453784165 * (r = temp - 55) -
                40.25366309332127 * log$1(r);
            g =
                325.4494125711974 +
                0.07943456536662342 * (g = temp - 50) -
                28.0852963507957 * log$1(g);
            b = 255;
        }
        return [r, g, b, 1];
    };

    /*
     * Based on implementation by Neil Bartlett
     * https://github.com/neilbartlett/color-temperature
     **/

    var round = Math.round;

    var rgb2temperature = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var rgb = unpack(args, 'rgb');
        var r = rgb[0],
            b = rgb[2];
        var minTemp = 1000;
        var maxTemp = 40000;
        var eps = 0.4;
        var temp;
        while (maxTemp - minTemp > eps) {
            temp = (maxTemp + minTemp) * 0.5;
            var rgb$1 = temperature2rgb(temp);
            if (rgb$1[2] / rgb$1[0] >= b / r) {
                maxTemp = temp;
            } else {
                minTemp = temp;
            }
        }
        return round(temp);
    };

    Color.prototype.temp =
        Color.prototype.kelvin =
        Color.prototype.temperature =
            function () {
                return rgb2temperature(this._rgb);
            };

    var temp = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color, [ null ].concat( args, ['temp']) ));
    };
    Object.assign(chroma, { temp: temp, kelvin: temp, temperature: temp });

    input.format.temp =
        input.format.kelvin =
        input.format.temperature =
            temperature2rgb;

    Color.prototype.oklab = function () {
        return rgb2oklab(this._rgb);
    };

    var oklab$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color, [ null ].concat( args, ['oklab']) ));
    };
    Object.assign(chroma, { oklab: oklab$1 });

    input.format.oklab = oklab2rgb;

    input.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack(args, 'oklab');
            if (type(args) === 'array' && args.length === 3) {
                return 'oklab';
            }
        }
    });

    Color.prototype.oklch = function () {
        return rgb2oklch(this._rgb);
    };

    var oklch$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color, [ null ].concat( args, ['oklch']) ));
    };
    Object.assign(chroma, { oklch: oklch$1 });

    input.format.oklch = oklch2rgb;

    input.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack(args, 'oklch');
            if (type(args) === 'array' && args.length === 3) {
                return 'oklch';
            }
        }
    });

    /**
    	X11 color names

    	http://www.w3.org/TR/css3-color/#svg-color
    */

    var w3cx11 = {
        aliceblue: '#f0f8ff',
        antiquewhite: '#faebd7',
        aqua: '#00ffff',
        aquamarine: '#7fffd4',
        azure: '#f0ffff',
        beige: '#f5f5dc',
        bisque: '#ffe4c4',
        black: '#000000',
        blanchedalmond: '#ffebcd',
        blue: '#0000ff',
        blueviolet: '#8a2be2',
        brown: '#a52a2a',
        burlywood: '#deb887',
        cadetblue: '#5f9ea0',
        chartreuse: '#7fff00',
        chocolate: '#d2691e',
        coral: '#ff7f50',
        cornflowerblue: '#6495ed',
        cornsilk: '#fff8dc',
        crimson: '#dc143c',
        cyan: '#00ffff',
        darkblue: '#00008b',
        darkcyan: '#008b8b',
        darkgoldenrod: '#b8860b',
        darkgray: '#a9a9a9',
        darkgreen: '#006400',
        darkgrey: '#a9a9a9',
        darkkhaki: '#bdb76b',
        darkmagenta: '#8b008b',
        darkolivegreen: '#556b2f',
        darkorange: '#ff8c00',
        darkorchid: '#9932cc',
        darkred: '#8b0000',
        darksalmon: '#e9967a',
        darkseagreen: '#8fbc8f',
        darkslateblue: '#483d8b',
        darkslategray: '#2f4f4f',
        darkslategrey: '#2f4f4f',
        darkturquoise: '#00ced1',
        darkviolet: '#9400d3',
        deeppink: '#ff1493',
        deepskyblue: '#00bfff',
        dimgray: '#696969',
        dimgrey: '#696969',
        dodgerblue: '#1e90ff',
        firebrick: '#b22222',
        floralwhite: '#fffaf0',
        forestgreen: '#228b22',
        fuchsia: '#ff00ff',
        gainsboro: '#dcdcdc',
        ghostwhite: '#f8f8ff',
        gold: '#ffd700',
        goldenrod: '#daa520',
        gray: '#808080',
        green: '#008000',
        greenyellow: '#adff2f',
        grey: '#808080',
        honeydew: '#f0fff0',
        hotpink: '#ff69b4',
        indianred: '#cd5c5c',
        indigo: '#4b0082',
        ivory: '#fffff0',
        khaki: '#f0e68c',
        laserlemon: '#ffff54',
        lavender: '#e6e6fa',
        lavenderblush: '#fff0f5',
        lawngreen: '#7cfc00',
        lemonchiffon: '#fffacd',
        lightblue: '#add8e6',
        lightcoral: '#f08080',
        lightcyan: '#e0ffff',
        lightgoldenrod: '#fafad2',
        lightgoldenrodyellow: '#fafad2',
        lightgray: '#d3d3d3',
        lightgreen: '#90ee90',
        lightgrey: '#d3d3d3',
        lightpink: '#ffb6c1',
        lightsalmon: '#ffa07a',
        lightseagreen: '#20b2aa',
        lightskyblue: '#87cefa',
        lightslategray: '#778899',
        lightslategrey: '#778899',
        lightsteelblue: '#b0c4de',
        lightyellow: '#ffffe0',
        lime: '#00ff00',
        limegreen: '#32cd32',
        linen: '#faf0e6',
        magenta: '#ff00ff',
        maroon: '#800000',
        maroon2: '#7f0000',
        maroon3: '#b03060',
        mediumaquamarine: '#66cdaa',
        mediumblue: '#0000cd',
        mediumorchid: '#ba55d3',
        mediumpurple: '#9370db',
        mediumseagreen: '#3cb371',
        mediumslateblue: '#7b68ee',
        mediumspringgreen: '#00fa9a',
        mediumturquoise: '#48d1cc',
        mediumvioletred: '#c71585',
        midnightblue: '#191970',
        mintcream: '#f5fffa',
        mistyrose: '#ffe4e1',
        moccasin: '#ffe4b5',
        navajowhite: '#ffdead',
        navy: '#000080',
        oldlace: '#fdf5e6',
        olive: '#808000',
        olivedrab: '#6b8e23',
        orange: '#ffa500',
        orangered: '#ff4500',
        orchid: '#da70d6',
        palegoldenrod: '#eee8aa',
        palegreen: '#98fb98',
        paleturquoise: '#afeeee',
        palevioletred: '#db7093',
        papayawhip: '#ffefd5',
        peachpuff: '#ffdab9',
        peru: '#cd853f',
        pink: '#ffc0cb',
        plum: '#dda0dd',
        powderblue: '#b0e0e6',
        purple: '#800080',
        purple2: '#7f007f',
        purple3: '#a020f0',
        rebeccapurple: '#663399',
        red: '#ff0000',
        rosybrown: '#bc8f8f',
        royalblue: '#4169e1',
        saddlebrown: '#8b4513',
        salmon: '#fa8072',
        sandybrown: '#f4a460',
        seagreen: '#2e8b57',
        seashell: '#fff5ee',
        sienna: '#a0522d',
        silver: '#c0c0c0',
        skyblue: '#87ceeb',
        slateblue: '#6a5acd',
        slategray: '#708090',
        slategrey: '#708090',
        snow: '#fffafa',
        springgreen: '#00ff7f',
        steelblue: '#4682b4',
        tan: '#d2b48c',
        teal: '#008080',
        thistle: '#d8bfd8',
        tomato: '#ff6347',
        turquoise: '#40e0d0',
        violet: '#ee82ee',
        wheat: '#f5deb3',
        white: '#ffffff',
        whitesmoke: '#f5f5f5',
        yellow: '#ffff00',
        yellowgreen: '#9acd32'
    };

    Color.prototype.name = function () {
        var hex = rgb2hex(this._rgb, 'rgb');
        for (var i = 0, list = Object.keys(w3cx11); i < list.length; i += 1) {
            var n = list[i];

            if (w3cx11[n] === hex) { return n.toLowerCase(); }
        }
        return hex;
    };

    input.format.named = function (name) {
        name = name.toLowerCase();
        if (w3cx11[name]) { return hex2rgb(w3cx11[name]); }
        throw new Error('unknown color name: ' + name);
    };

    input.autodetect.push({
        p: 5,
        test: function (h) {
            var rest = [], len = arguments.length - 1;
            while ( len-- > 0 ) rest[ len ] = arguments[ len + 1 ];

            if (!rest.length && type(h) === 'string' && w3cx11[h.toLowerCase()]) {
                return 'named';
            }
        }
    });

    Color.prototype.alpha = function (a, mutate) {
        if ( mutate === void 0 ) mutate = false;

        if (a !== undefined && type(a) === 'number') {
            if (mutate) {
                this._rgb[3] = a;
                return this;
            }
            return new Color([this._rgb[0], this._rgb[1], this._rgb[2], a], 'rgb');
        }
        return this._rgb[3];
    };

    Color.prototype.clipped = function () {
        return this._rgb._clipped || false;
    };

    Color.prototype.darken = function (amount) {
        if ( amount === void 0 ) amount = 1;

        var me = this;
        var lab = me.lab();
        lab[0] -= labConstants.Kn * amount;
        return new Color(lab, 'lab').alpha(me.alpha(), true);
    };

    Color.prototype.brighten = function (amount) {
        if ( amount === void 0 ) amount = 1;

        return this.darken(-amount);
    };

    Color.prototype.darker = Color.prototype.darken;
    Color.prototype.brighter = Color.prototype.brighten;

    Color.prototype.get = function (mc) {
        var ref = mc.split('.');
        var mode = ref[0];
        var channel = ref[1];
        var src = this[mode]();
        if (channel) {
            var i = mode.indexOf(channel) - (mode.substr(0, 2) === 'ok' ? 2 : 0);
            if (i > -1) { return src[i]; }
            throw new Error(("unknown channel " + channel + " in mode " + mode));
        } else {
            return src;
        }
    };

    var pow$6 = Math.pow;

    var EPS = 1e-7;
    var MAX_ITER = 20;

    Color.prototype.luminance = function (lum, mode) {
        if ( mode === void 0 ) mode = 'rgb';

        if (lum !== undefined && type(lum) === 'number') {
            if (lum === 0) {
                // return pure black
                return new Color([0, 0, 0, this._rgb[3]], 'rgb');
            }
            if (lum === 1) {
                // return pure white
                return new Color([255, 255, 255, this._rgb[3]], 'rgb');
            }
            // compute new color using...
            var cur_lum = this.luminance();
            var max_iter = MAX_ITER;

            var test = function (low, high) {
                var mid = low.interpolate(high, 0.5, mode);
                var lm = mid.luminance();
                if (Math.abs(lum - lm) < EPS || !max_iter--) {
                    // close enough
                    return mid;
                }
                return lm > lum ? test(low, mid) : test(mid, high);
            };

            var rgb = (
                cur_lum > lum
                    ? test(new Color([0, 0, 0]), this)
                    : test(this, new Color([255, 255, 255]))
            ).rgb();
            return new Color(rgb.concat( [this._rgb[3]]));
        }
        return rgb2luminance.apply(void 0, this._rgb.slice(0, 3));
    };

    var rgb2luminance = function (r, g, b) {
        // relative luminance
        // see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
        r = luminance_x(r);
        g = luminance_x(g);
        b = luminance_x(b);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    var luminance_x = function (x) {
        x /= 255;
        return x <= 0.03928 ? x / 12.92 : pow$6((x + 0.055) / 1.055, 2.4);
    };

    var index = {};

    function mix (col1, col2, f) {
        if ( f === void 0 ) f = 0.5;
        var rest = [], len = arguments.length - 3;
        while ( len-- > 0 ) rest[ len ] = arguments[ len + 3 ];

        var mode = rest[0] || 'lrgb';
        if (!index[mode] && !rest.length) {
            // fall back to the first supported mode
            mode = Object.keys(index)[0];
        }
        if (!index[mode]) {
            throw new Error(("interpolation mode " + mode + " is not defined"));
        }
        if (type(col1) !== 'object') { col1 = new Color(col1); }
        if (type(col2) !== 'object') { col2 = new Color(col2); }
        return index[mode](col1, col2, f).alpha(
            col1.alpha() + f * (col2.alpha() - col1.alpha())
        );
    }

    Color.prototype.mix = Color.prototype.interpolate = function (
        col2,
        f
    ) {
        if ( f === void 0 ) f = 0.5;
        var rest = [], len = arguments.length - 2;
        while ( len-- > 0 ) rest[ len ] = arguments[ len + 2 ];

        return mix.apply(void 0, [ this, col2, f ].concat( rest ));
    };

    Color.prototype.premultiply = function (mutate) {
        if ( mutate === void 0 ) mutate = false;

        var rgb = this._rgb;
        var a = rgb[3];
        if (mutate) {
            this._rgb = [rgb[0] * a, rgb[1] * a, rgb[2] * a, a];
            return this;
        } else {
            return new Color([rgb[0] * a, rgb[1] * a, rgb[2] * a, a], 'rgb');
        }
    };

    Color.prototype.saturate = function (amount) {
        if ( amount === void 0 ) amount = 1;

        var me = this;
        var lch = me.lch();
        lch[1] += labConstants.Kn * amount;
        if (lch[1] < 0) { lch[1] = 0; }
        return new Color(lch, 'lch').alpha(me.alpha(), true);
    };

    Color.prototype.desaturate = function (amount) {
        if ( amount === void 0 ) amount = 1;

        return this.saturate(-amount);
    };

    Color.prototype.set = function (mc, value, mutate) {
        if ( mutate === void 0 ) mutate = false;

        var ref = mc.split('.');
        var mode = ref[0];
        var channel = ref[1];
        var src = this[mode]();
        if (channel) {
            var i = mode.indexOf(channel) - (mode.substr(0, 2) === 'ok' ? 2 : 0);
            if (i > -1) {
                if (type(value) == 'string') {
                    switch (value.charAt(0)) {
                        case '+':
                            src[i] += +value;
                            break;
                        case '-':
                            src[i] += +value;
                            break;
                        case '*':
                            src[i] *= +value.substr(1);
                            break;
                        case '/':
                            src[i] /= +value.substr(1);
                            break;
                        default:
                            src[i] = +value;
                    }
                } else if (type(value) === 'number') {
                    src[i] = value;
                } else {
                    throw new Error("unsupported value for Color.set");
                }
                var out = new Color(src, mode);
                if (mutate) {
                    this._rgb = out._rgb;
                    return this;
                }
                return out;
            }
            throw new Error(("unknown channel " + channel + " in mode " + mode));
        } else {
            return src;
        }
    };

    Color.prototype.tint = function (f) {
        if ( f === void 0 ) f = 0.5;
        var rest = [], len = arguments.length - 1;
        while ( len-- > 0 ) rest[ len ] = arguments[ len + 1 ];

        return mix.apply(void 0, [ this, 'white', f ].concat( rest ));
    };

    Color.prototype.shade = function (f) {
        if ( f === void 0 ) f = 0.5;
        var rest = [], len = arguments.length - 1;
        while ( len-- > 0 ) rest[ len ] = arguments[ len + 1 ];

        return mix.apply(void 0, [ this, 'black', f ].concat( rest ));
    };

    var rgb = function (col1, col2, f) {
        var xyz0 = col1._rgb;
        var xyz1 = col2._rgb;
        return new Color(
            xyz0[0] + f * (xyz1[0] - xyz0[0]),
            xyz0[1] + f * (xyz1[1] - xyz0[1]),
            xyz0[2] + f * (xyz1[2] - xyz0[2]),
            'rgb'
        );
    };

    // register interpolator
    index.rgb = rgb;

    var sqrt$2 = Math.sqrt;
    var pow$5 = Math.pow;

    var lrgb = function (col1, col2, f) {
        var ref = col1._rgb;
        var x1 = ref[0];
        var y1 = ref[1];
        var z1 = ref[2];
        var ref$1 = col2._rgb;
        var x2 = ref$1[0];
        var y2 = ref$1[1];
        var z2 = ref$1[2];
        return new Color(
            sqrt$2(pow$5(x1, 2) * (1 - f) + pow$5(x2, 2) * f),
            sqrt$2(pow$5(y1, 2) * (1 - f) + pow$5(y2, 2) * f),
            sqrt$2(pow$5(z1, 2) * (1 - f) + pow$5(z2, 2) * f),
            'rgb'
        );
    };

    // register interpolator
    index.lrgb = lrgb;

    var lab = function (col1, col2, f) {
        var xyz0 = col1.lab();
        var xyz1 = col2.lab();
        return new Color(
            xyz0[0] + f * (xyz1[0] - xyz0[0]),
            xyz0[1] + f * (xyz1[1] - xyz0[1]),
            xyz0[2] + f * (xyz1[2] - xyz0[2]),
            'lab'
        );
    };

    // register interpolator
    index.lab = lab;

    function interpolate_hsx (col1, col2, f, m) {
        var assign, assign$1;

        var xyz0, xyz1;
        if (m === 'hsl') {
            xyz0 = col1.hsl();
            xyz1 = col2.hsl();
        } else if (m === 'hsv') {
            xyz0 = col1.hsv();
            xyz1 = col2.hsv();
        } else if (m === 'hcg') {
            xyz0 = col1.hcg();
            xyz1 = col2.hcg();
        } else if (m === 'hsi') {
            xyz0 = col1.hsi();
            xyz1 = col2.hsi();
        } else if (m === 'lch' || m === 'hcl') {
            m = 'hcl';
            xyz0 = col1.hcl();
            xyz1 = col2.hcl();
        } else if (m === 'oklch') {
            xyz0 = col1.oklch().reverse();
            xyz1 = col2.oklch().reverse();
        }

        var hue0, hue1, sat0, sat1, lbv0, lbv1;
        if (m.substr(0, 1) === 'h' || m === 'oklch') {
            (assign = xyz0, hue0 = assign[0], sat0 = assign[1], lbv0 = assign[2]);
            (assign$1 = xyz1, hue1 = assign$1[0], sat1 = assign$1[1], lbv1 = assign$1[2]);
        }

        var sat, hue, lbv, dh;

        if (!isNaN(hue0) && !isNaN(hue1)) {
            // both colors have hue
            if (hue1 > hue0 && hue1 - hue0 > 180) {
                dh = hue1 - (hue0 + 360);
            } else if (hue1 < hue0 && hue0 - hue1 > 180) {
                dh = hue1 + 360 - hue0;
            } else {
                dh = hue1 - hue0;
            }
            hue = hue0 + f * dh;
        } else if (!isNaN(hue0)) {
            hue = hue0;
            if ((lbv1 == 1 || lbv1 == 0) && m != 'hsv') { sat = sat0; }
        } else if (!isNaN(hue1)) {
            hue = hue1;
            if ((lbv0 == 1 || lbv0 == 0) && m != 'hsv') { sat = sat1; }
        } else {
            hue = Number.NaN;
        }

        if (sat === undefined) { sat = sat0 + f * (sat1 - sat0); }
        lbv = lbv0 + f * (lbv1 - lbv0);
        return m === 'oklch'
            ? new Color([lbv, sat, hue], m)
            : new Color([hue, sat, lbv], m);
    }

    var lch = function (col1, col2, f) {
        return interpolate_hsx(col1, col2, f, 'lch');
    };

    // register interpolator
    index.lch = lch;
    index.hcl = lch;

    var num = function (col1, col2, f) {
        var c1 = col1.num();
        var c2 = col2.num();
        return new Color(c1 + f * (c2 - c1), 'num');
    };

    // register interpolator
    index.num = num;

    var hcg = function (col1, col2, f) {
        return interpolate_hsx(col1, col2, f, 'hcg');
    };

    // register interpolator
    index.hcg = hcg;

    var hsi = function (col1, col2, f) {
        return interpolate_hsx(col1, col2, f, 'hsi');
    };

    // register interpolator
    index.hsi = hsi;

    var hsl = function (col1, col2, f) {
        return interpolate_hsx(col1, col2, f, 'hsl');
    };

    // register interpolator
    index.hsl = hsl;

    var hsv = function (col1, col2, f) {
        return interpolate_hsx(col1, col2, f, 'hsv');
    };

    // register interpolator
    index.hsv = hsv;

    var oklab = function (col1, col2, f) {
        var xyz0 = col1.oklab();
        var xyz1 = col2.oklab();
        return new Color(
            xyz0[0] + f * (xyz1[0] - xyz0[0]),
            xyz0[1] + f * (xyz1[1] - xyz0[1]),
            xyz0[2] + f * (xyz1[2] - xyz0[2]),
            'oklab'
        );
    };

    // register interpolator
    index.oklab = oklab;

    var oklch = function (col1, col2, f) {
        return interpolate_hsx(col1, col2, f, 'oklch');
    };

    // register interpolator
    index.oklch = oklch;

    var pow$4 = Math.pow;
    var sqrt$1 = Math.sqrt;
    var PI$1 = Math.PI;
    var cos$2 = Math.cos;
    var sin$2 = Math.sin;
    var atan2$1 = Math.atan2;

    function average (colors, mode, weights) {
        if ( mode === void 0 ) mode = 'lrgb';
        if ( weights === void 0 ) weights = null;

        var l = colors.length;
        if (!weights) { weights = Array.from(new Array(l)).map(function () { return 1; }); }
        // normalize weights
        var k =
            l /
            weights.reduce(function (a, b) {
                return a + b;
            });
        weights.forEach(function (w, i) {
            weights[i] *= k;
        });
        // convert colors to Color objects
        colors = colors.map(function (c) { return new Color(c); });
        if (mode === 'lrgb') {
            return _average_lrgb(colors, weights);
        }
        var first = colors.shift();
        var xyz = first.get(mode);
        var cnt = [];
        var dx = 0;
        var dy = 0;
        // initial color
        for (var i = 0; i < xyz.length; i++) {
            xyz[i] = (xyz[i] || 0) * weights[0];
            cnt.push(isNaN(xyz[i]) ? 0 : weights[0]);
            if (mode.charAt(i) === 'h' && !isNaN(xyz[i])) {
                var A = (xyz[i] / 180) * PI$1;
                dx += cos$2(A) * weights[0];
                dy += sin$2(A) * weights[0];
            }
        }

        var alpha = first.alpha() * weights[0];
        colors.forEach(function (c, ci) {
            var xyz2 = c.get(mode);
            alpha += c.alpha() * weights[ci + 1];
            for (var i = 0; i < xyz.length; i++) {
                if (!isNaN(xyz2[i])) {
                    cnt[i] += weights[ci + 1];
                    if (mode.charAt(i) === 'h') {
                        var A = (xyz2[i] / 180) * PI$1;
                        dx += cos$2(A) * weights[ci + 1];
                        dy += sin$2(A) * weights[ci + 1];
                    } else {
                        xyz[i] += xyz2[i] * weights[ci + 1];
                    }
                }
            }
        });

        for (var i$1 = 0; i$1 < xyz.length; i$1++) {
            if (mode.charAt(i$1) === 'h') {
                var A$1 = (atan2$1(dy / cnt[i$1], dx / cnt[i$1]) / PI$1) * 180;
                while (A$1 < 0) { A$1 += 360; }
                while (A$1 >= 360) { A$1 -= 360; }
                xyz[i$1] = A$1;
            } else {
                xyz[i$1] = xyz[i$1] / cnt[i$1];
            }
        }
        alpha /= l;
        return new Color(xyz, mode).alpha(alpha > 0.99999 ? 1 : alpha, true);
    }
    var _average_lrgb = function (colors, weights) {
        var l = colors.length;
        var xyz = [0, 0, 0, 0];
        for (var i = 0; i < colors.length; i++) {
            var col = colors[i];
            var f = weights[i] / l;
            var rgb = col._rgb;
            xyz[0] += pow$4(rgb[0], 2) * f;
            xyz[1] += pow$4(rgb[1], 2) * f;
            xyz[2] += pow$4(rgb[2], 2) * f;
            xyz[3] += rgb[3] * f;
        }
        xyz[0] = sqrt$1(xyz[0]);
        xyz[1] = sqrt$1(xyz[1]);
        xyz[2] = sqrt$1(xyz[2]);
        if (xyz[3] > 0.9999999) { xyz[3] = 1; }
        return new Color(clip_rgb(xyz));
    };

    // minimal multi-purpose interface


    var pow$3 = Math.pow;

    function scale (colors) {
        // constructor
        var _mode = 'rgb';
        var _nacol = chroma('#ccc');
        var _spread = 0;
        // const _fixed = false;
        var _domain = [0, 1];
        var _pos = [];
        var _padding = [0, 0];
        var _classes = false;
        var _colors = [];
        var _out = false;
        var _min = 0;
        var _max = 1;
        var _correctLightness = false;
        var _colorCache = {};
        var _useCache = true;
        var _gamma = 1;

        // private methods

        var setColors = function (colors) {
            colors = colors || ['#fff', '#000'];
            if (
                colors &&
                type(colors) === 'string' &&
                chroma.brewer &&
                chroma.brewer[colors.toLowerCase()]
            ) {
                colors = chroma.brewer[colors.toLowerCase()];
            }
            if (type(colors) === 'array') {
                // handle single color
                if (colors.length === 1) {
                    colors = [colors[0], colors[0]];
                }
                // make a copy of the colors
                colors = colors.slice(0);
                // convert to chroma classes
                for (var c = 0; c < colors.length; c++) {
                    colors[c] = chroma(colors[c]);
                }
                // auto-fill color position
                _pos.length = 0;
                for (var c$1 = 0; c$1 < colors.length; c$1++) {
                    _pos.push(c$1 / (colors.length - 1));
                }
            }
            resetCache();
            return (_colors = colors);
        };

        var getClass = function (value) {
            if (_classes != null) {
                var n = _classes.length - 1;
                var i = 0;
                while (i < n && value >= _classes[i]) {
                    i++;
                }
                return i - 1;
            }
            return 0;
        };

        var tMapLightness = function (t) { return t; };
        var tMapDomain = function (t) { return t; };

        // const classifyValue = function(value) {
        //     let val = value;
        //     if (_classes.length > 2) {
        //         const n = _classes.length-1;
        //         const i = getClass(value);
        //         const minc = _classes[0] + ((_classes[1]-_classes[0]) * (0 + (_spread * 0.5)));  // center of 1st class
        //         const maxc = _classes[n-1] + ((_classes[n]-_classes[n-1]) * (1 - (_spread * 0.5)));  // center of last class
        //         val = _min + ((((_classes[i] + ((_classes[i+1] - _classes[i]) * 0.5)) - minc) / (maxc-minc)) * (_max - _min));
        //     }
        //     return val;
        // };

        var getColor = function (val, bypassMap) {
            var col, t;
            if (bypassMap == null) {
                bypassMap = false;
            }
            if (isNaN(val) || val === null) {
                return _nacol;
            }
            if (!bypassMap) {
                if (_classes && _classes.length > 2) {
                    // find the class
                    var c = getClass(val);
                    t = c / (_classes.length - 2);
                } else if (_max !== _min) {
                    // just interpolate between min/max
                    t = (val - _min) / (_max - _min);
                } else {
                    t = 1;
                }
            } else {
                t = val;
            }

            // domain map
            t = tMapDomain(t);

            if (!bypassMap) {
                t = tMapLightness(t); // lightness correction
            }

            if (_gamma !== 1) {
                t = pow$3(t, _gamma);
            }

            t = _padding[0] + t * (1 - _padding[0] - _padding[1]);

            t = limit(t, 0, 1);

            var k = Math.floor(t * 10000);

            if (_useCache && _colorCache[k]) {
                col = _colorCache[k];
            } else {
                if (type(_colors) === 'array') {
                    //for i in [0.._pos.length-1]
                    for (var i = 0; i < _pos.length; i++) {
                        var p = _pos[i];
                        if (t <= p) {
                            col = _colors[i];
                            break;
                        }
                        if (t >= p && i === _pos.length - 1) {
                            col = _colors[i];
                            break;
                        }
                        if (t > p && t < _pos[i + 1]) {
                            t = (t - p) / (_pos[i + 1] - p);
                            col = chroma.interpolate(
                                _colors[i],
                                _colors[i + 1],
                                t,
                                _mode
                            );
                            break;
                        }
                    }
                } else if (type(_colors) === 'function') {
                    col = _colors(t);
                }
                if (_useCache) {
                    _colorCache[k] = col;
                }
            }
            return col;
        };

        var resetCache = function () { return (_colorCache = {}); };

        setColors(colors);

        // public interface

        var f = function (v) {
            var c = chroma(getColor(v));
            if (_out && c[_out]) {
                return c[_out]();
            } else {
                return c;
            }
        };

        f.classes = function (classes) {
            if (classes != null) {
                if (type(classes) === 'array') {
                    _classes = classes;
                    _domain = [classes[0], classes[classes.length - 1]];
                } else {
                    var d = chroma.analyze(_domain);
                    if (classes === 0) {
                        _classes = [d.min, d.max];
                    } else {
                        _classes = chroma.limits(d, 'e', classes);
                    }
                }
                return f;
            }
            return _classes;
        };

        f.domain = function (domain) {
            if (!arguments.length) {
                return _domain;
            }
            _min = domain[0];
            _max = domain[domain.length - 1];
            _pos = [];
            var k = _colors.length;
            if (domain.length === k && _min !== _max) {
                // update positions
                for (var i = 0, list = Array.from(domain); i < list.length; i += 1) {
                    var d = list[i];

                    _pos.push((d - _min) / (_max - _min));
                }
            } else {
                for (var c = 0; c < k; c++) {
                    _pos.push(c / (k - 1));
                }
                if (domain.length > 2) {
                    // set domain map
                    var tOut = domain.map(function (d, i) { return i / (domain.length - 1); });
                    var tBreaks = domain.map(function (d) { return (d - _min) / (_max - _min); });
                    if (!tBreaks.every(function (val, i) { return tOut[i] === val; })) {
                        tMapDomain = function (t) {
                            if (t <= 0 || t >= 1) { return t; }
                            var i = 0;
                            while (t >= tBreaks[i + 1]) { i++; }
                            var f =
                                (t - tBreaks[i]) / (tBreaks[i + 1] - tBreaks[i]);
                            var out = tOut[i] + f * (tOut[i + 1] - tOut[i]);
                            return out;
                        };
                    }
                }
            }
            _domain = [_min, _max];
            return f;
        };

        f.mode = function (_m) {
            if (!arguments.length) {
                return _mode;
            }
            _mode = _m;
            resetCache();
            return f;
        };

        f.range = function (colors, _pos) {
            setColors(colors);
            return f;
        };

        f.out = function (_o) {
            _out = _o;
            return f;
        };

        f.spread = function (val) {
            if (!arguments.length) {
                return _spread;
            }
            _spread = val;
            return f;
        };

        f.correctLightness = function (v) {
            if (v == null) {
                v = true;
            }
            _correctLightness = v;
            resetCache();
            if (_correctLightness) {
                tMapLightness = function (t) {
                    var L0 = getColor(0, true).lab()[0];
                    var L1 = getColor(1, true).lab()[0];
                    var pol = L0 > L1;
                    var L_actual = getColor(t, true).lab()[0];
                    var L_ideal = L0 + (L1 - L0) * t;
                    var L_diff = L_actual - L_ideal;
                    var t0 = 0;
                    var t1 = 1;
                    var max_iter = 20;
                    while (Math.abs(L_diff) > 1e-2 && max_iter-- > 0) {
                        (function () {
                            if (pol) {
                                L_diff *= -1;
                            }
                            if (L_diff < 0) {
                                t0 = t;
                                t += (t1 - t) * 0.5;
                            } else {
                                t1 = t;
                                t += (t0 - t) * 0.5;
                            }
                            L_actual = getColor(t, true).lab()[0];
                            return (L_diff = L_actual - L_ideal);
                        })();
                    }
                    return t;
                };
            } else {
                tMapLightness = function (t) { return t; };
            }
            return f;
        };

        f.padding = function (p) {
            if (p != null) {
                if (type(p) === 'number') {
                    p = [p, p];
                }
                _padding = p;
                return f;
            } else {
                return _padding;
            }
        };

        f.colors = function (numColors, out) {
            // If no arguments are given, return the original colors that were provided
            if (arguments.length < 2) {
                out = 'hex';
            }
            var result = [];

            if (arguments.length === 0) {
                result = _colors.slice(0);
            } else if (numColors === 1) {
                result = [f(0.5)];
            } else if (numColors > 1) {
                var dm = _domain[0];
                var dd = _domain[1] - dm;
                result = __range__(0, numColors).map(function (i) { return f(dm + (i / (numColors - 1)) * dd); }
                );
            } else {
                // returns all colors based on the defined classes
                colors = [];
                var samples = [];
                if (_classes && _classes.length > 2) {
                    for (
                        var i = 1, end = _classes.length, asc = 1 <= end;
                        asc ? i < end : i > end;
                        asc ? i++ : i--
                    ) {
                        samples.push((_classes[i - 1] + _classes[i]) * 0.5);
                    }
                } else {
                    samples = _domain;
                }
                result = samples.map(function (v) { return f(v); });
            }

            if (chroma[out]) {
                result = result.map(function (c) { return c[out](); });
            }
            return result;
        };

        f.cache = function (c) {
            if (c != null) {
                _useCache = c;
                return f;
            } else {
                return _useCache;
            }
        };

        f.gamma = function (g) {
            if (g != null) {
                _gamma = g;
                return f;
            } else {
                return _gamma;
            }
        };

        f.nodata = function (d) {
            if (d != null) {
                _nacol = chroma(d);
                return f;
            } else {
                return _nacol;
            }
        };

        return f;
    }

    function __range__(left, right, inclusive) {
        var range = [];
        var ascending = left < right;
        var end = right ;
        for (var i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
            range.push(i);
        }
        return range;
    }

    //
    // interpolates between a set of colors uzing a bezier spline
    //


    // nth row of the pascal triangle
    var binom_row = function (n) {
        var row = [1, 1];
        for (var i = 1; i < n; i++) {
            var newrow = [1];
            for (var j = 1; j <= row.length; j++) {
                newrow[j] = (row[j] || 0) + row[j - 1];
            }
            row = newrow;
        }
        return row;
    };

    var bezier = function (colors) {
        var assign, assign$1, assign$2;

        var I, lab0, lab1, lab2;
        colors = colors.map(function (c) { return new Color(c); });
        if (colors.length === 2) {
            // linear interpolation
            (assign = colors.map(function (c) { return c.lab(); }), lab0 = assign[0], lab1 = assign[1]);
            I = function (t) {
                var lab = [0, 1, 2].map(function (i) { return lab0[i] + t * (lab1[i] - lab0[i]); });
                return new Color(lab, 'lab');
            };
        } else if (colors.length === 3) {
            // quadratic bezier interpolation
            (assign$1 = colors.map(function (c) { return c.lab(); }), lab0 = assign$1[0], lab1 = assign$1[1], lab2 = assign$1[2]);
            I = function (t) {
                var lab = [0, 1, 2].map(
                    function (i) { return (1 - t) * (1 - t) * lab0[i] +
                        2 * (1 - t) * t * lab1[i] +
                        t * t * lab2[i]; }
                );
                return new Color(lab, 'lab');
            };
        } else if (colors.length === 4) {
            // cubic bezier interpolation
            var lab3;
            (assign$2 = colors.map(function (c) { return c.lab(); }), lab0 = assign$2[0], lab1 = assign$2[1], lab2 = assign$2[2], lab3 = assign$2[3]);
            I = function (t) {
                var lab = [0, 1, 2].map(
                    function (i) { return (1 - t) * (1 - t) * (1 - t) * lab0[i] +
                        3 * (1 - t) * (1 - t) * t * lab1[i] +
                        3 * (1 - t) * t * t * lab2[i] +
                        t * t * t * lab3[i]; }
                );
                return new Color(lab, 'lab');
            };
        } else if (colors.length >= 5) {
            // general case (degree n bezier)
            var labs, row, n;
            labs = colors.map(function (c) { return c.lab(); });
            n = colors.length - 1;
            row = binom_row(n);
            I = function (t) {
                var u = 1 - t;
                var lab = [0, 1, 2].map(function (i) { return labs.reduce(
                        function (sum, el, j) { return sum + row[j] * Math.pow( u, (n - j) ) * Math.pow( t, j ) * el[i]; },
                        0
                    ); }
                );
                return new Color(lab, 'lab');
            };
        } else {
            throw new RangeError('No point in running bezier with only one color.');
        }
        return I;
    };

    function bezier$1 (colors) {
        var f = bezier(colors);
        f.scale = function () { return scale(f); };
        return f;
    }

    /*
     * interpolates between a set of colors uzing a bezier spline
     * blend mode formulas taken from https://web.archive.org/web/20180110014946/http://www.venture-ware.com/kevin/coding/lets-learn-math-photoshop-blend-modes/
     */


    var blend = function (bottom, top, mode) {
        if (!blend[mode]) {
            throw new Error('unknown blend mode ' + mode);
        }
        return blend[mode](bottom, top);
    };

    var blend_f = function (f) { return function (bottom, top) {
        var c0 = chroma(top).rgb();
        var c1 = chroma(bottom).rgb();
        return chroma.rgb(f(c0, c1));
    }; };

    var each = function (f) { return function (c0, c1) {
        var out = [];
        out[0] = f(c0[0], c1[0]);
        out[1] = f(c0[1], c1[1]);
        out[2] = f(c0[2], c1[2]);
        return out;
    }; };

    var normal = function (a) { return a; };
    var multiply = function (a, b) { return (a * b) / 255; };
    var darken = function (a, b) { return (a > b ? b : a); };
    var lighten = function (a, b) { return (a > b ? a : b); };
    var screen = function (a, b) { return 255 * (1 - (1 - a / 255) * (1 - b / 255)); };
    var overlay = function (a, b) { return b < 128 ? (2 * a * b) / 255 : 255 * (1 - 2 * (1 - a / 255) * (1 - b / 255)); };
    var burn = function (a, b) { return 255 * (1 - (1 - b / 255) / (a / 255)); };
    var dodge = function (a, b) {
        if (a === 255) { return 255; }
        a = (255 * (b / 255)) / (1 - a / 255);
        return a > 255 ? 255 : a;
    };

    // # add = (a,b) ->
    // #     if (a + b > 255) then 255 else a + b

    blend.normal = blend_f(each(normal));
    blend.multiply = blend_f(each(multiply));
    blend.screen = blend_f(each(screen));
    blend.overlay = blend_f(each(overlay));
    blend.darken = blend_f(each(darken));
    blend.lighten = blend_f(each(lighten));
    blend.dodge = blend_f(each(dodge));
    blend.burn = blend_f(each(burn));

    // cubehelix interpolation
    // based on D.A. Green "A colour scheme for the display of astronomical intensity images"
    // http://astron-soc.in/bulletin/11June/289392011.pdf
    var pow$2 = Math.pow;
    var sin$1 = Math.sin;
    var cos$1 = Math.cos;

    function cubehelix (
        start,
        rotations,
        hue,
        gamma,
        lightness
    ) {
        if ( start === void 0 ) start = 300;
        if ( rotations === void 0 ) rotations = -1.5;
        if ( hue === void 0 ) hue = 1;
        if ( gamma === void 0 ) gamma = 1;
        if ( lightness === void 0 ) lightness = [0, 1];

        var dh = 0,
            dl;
        if (type(lightness) === 'array') {
            dl = lightness[1] - lightness[0];
        } else {
            dl = 0;
            lightness = [lightness, lightness];
        }
        var f = function (fract) {
            var a = TWOPI * ((start + 120) / 360 + rotations * fract);
            var l = pow$2(lightness[0] + dl * fract, gamma);
            var h = dh !== 0 ? hue[0] + fract * dh : hue;
            var amp = (h * l * (1 - l)) / 2;
            var cos_a = cos$1(a);
            var sin_a = sin$1(a);
            var r = l + amp * (-0.14861 * cos_a + 1.78277 * sin_a);
            var g = l + amp * (-0.29227 * cos_a - 0.90649 * sin_a);
            var b = l + amp * (+1.97294 * cos_a);
            return chroma(clip_rgb([r * 255, g * 255, b * 255, 1]));
        };
        f.start = function (s) {
            if (s == null) {
                return start;
            }
            start = s;
            return f;
        };
        f.rotations = function (r) {
            if (r == null) {
                return rotations;
            }
            rotations = r;
            return f;
        };
        f.gamma = function (g) {
            if (g == null) {
                return gamma;
            }
            gamma = g;
            return f;
        };
        f.hue = function (h) {
            if (h == null) {
                return hue;
            }
            hue = h;
            if (type(hue) === 'array') {
                dh = hue[1] - hue[0];
                if (dh === 0) {
                    hue = hue[1];
                }
            } else {
                dh = 0;
            }
            return f;
        };
        f.lightness = function (h) {
            if (h == null) {
                return lightness;
            }
            if (type(h) === 'array') {
                lightness = h;
                dl = h[1] - h[0];
            } else {
                lightness = [h, h];
                dl = 0;
            }
            return f;
        };
        f.scale = function () { return chroma.scale(f); };
        f.hue(hue);
        return f;
    }

    var digits = '0123456789abcdef';

    var floor$1 = Math.floor;
    var random = Math.random;

    function random$1 () {
        var code = '#';
        for (var i = 0; i < 6; i++) {
            code += digits.charAt(floor$1(random() * 16));
        }
        return new Color(code, 'hex');
    }

    var log = Math.log;
    var pow$1 = Math.pow;
    var floor = Math.floor;
    var abs$1 = Math.abs;

    function analyze(data, key) {
        if ( key === void 0 ) key = null;

        var r = {
            min: Number.MAX_VALUE,
            max: Number.MAX_VALUE * -1,
            sum: 0,
            values: [],
            count: 0
        };
        if (type(data) === 'object') {
            data = Object.values(data);
        }
        data.forEach(function (val) {
            if (key && type(val) === 'object') { val = val[key]; }
            if (val !== undefined && val !== null && !isNaN(val)) {
                r.values.push(val);
                r.sum += val;
                if (val < r.min) { r.min = val; }
                if (val > r.max) { r.max = val; }
                r.count += 1;
            }
        });

        r.domain = [r.min, r.max];

        r.limits = function (mode, num) { return limits(r, mode, num); };

        return r;
    }

    function limits(data, mode, num) {
        if ( mode === void 0 ) mode = 'equal';
        if ( num === void 0 ) num = 7;

        if (type(data) == 'array') {
            data = analyze(data);
        }
        var min = data.min;
        var max = data.max;
        var values = data.values.sort(function (a, b) { return a - b; });

        if (num === 1) {
            return [min, max];
        }

        var limits = [];

        if (mode.substr(0, 1) === 'c') {
            // continuous
            limits.push(min);
            limits.push(max);
        }

        if (mode.substr(0, 1) === 'e') {
            // equal interval
            limits.push(min);
            for (var i = 1; i < num; i++) {
                limits.push(min + (i / num) * (max - min));
            }
            limits.push(max);
        } else if (mode.substr(0, 1) === 'l') {
            // log scale
            if (min <= 0) {
                throw new Error(
                    'Logarithmic scales are only possible for values > 0'
                );
            }
            var min_log = Math.LOG10E * log(min);
            var max_log = Math.LOG10E * log(max);
            limits.push(min);
            for (var i$1 = 1; i$1 < num; i$1++) {
                limits.push(pow$1(10, min_log + (i$1 / num) * (max_log - min_log)));
            }
            limits.push(max);
        } else if (mode.substr(0, 1) === 'q') {
            // quantile scale
            limits.push(min);
            for (var i$2 = 1; i$2 < num; i$2++) {
                var p = ((values.length - 1) * i$2) / num;
                var pb = floor(p);
                if (pb === p) {
                    limits.push(values[pb]);
                } else {
                    // p > pb
                    var pr = p - pb;
                    limits.push(values[pb] * (1 - pr) + values[pb + 1] * pr);
                }
            }
            limits.push(max);
        } else if (mode.substr(0, 1) === 'k') {
            // k-means clustering
            /*
            implementation based on
            http://code.google.com/p/figue/source/browse/trunk/figue.js#336
            simplified for 1-d input values
            */
            var cluster;
            var n = values.length;
            var assignments = new Array(n);
            var clusterSizes = new Array(num);
            var repeat = true;
            var nb_iters = 0;
            var centroids = null;

            // get seed values
            centroids = [];
            centroids.push(min);
            for (var i$3 = 1; i$3 < num; i$3++) {
                centroids.push(min + (i$3 / num) * (max - min));
            }
            centroids.push(max);

            while (repeat) {
                // assignment step
                for (var j = 0; j < num; j++) {
                    clusterSizes[j] = 0;
                }
                for (var i$4 = 0; i$4 < n; i$4++) {
                    var value = values[i$4];
                    var mindist = Number.MAX_VALUE;
                    var best = (void 0);
                    for (var j$1 = 0; j$1 < num; j$1++) {
                        var dist = abs$1(centroids[j$1] - value);
                        if (dist < mindist) {
                            mindist = dist;
                            best = j$1;
                        }
                        clusterSizes[best]++;
                        assignments[i$4] = best;
                    }
                }

                // update centroids step
                var newCentroids = new Array(num);
                for (var j$2 = 0; j$2 < num; j$2++) {
                    newCentroids[j$2] = null;
                }
                for (var i$5 = 0; i$5 < n; i$5++) {
                    cluster = assignments[i$5];
                    if (newCentroids[cluster] === null) {
                        newCentroids[cluster] = values[i$5];
                    } else {
                        newCentroids[cluster] += values[i$5];
                    }
                }
                for (var j$3 = 0; j$3 < num; j$3++) {
                    newCentroids[j$3] *= 1 / clusterSizes[j$3];
                }

                // check convergence
                repeat = false;
                for (var j$4 = 0; j$4 < num; j$4++) {
                    if (newCentroids[j$4] !== centroids[j$4]) {
                        repeat = true;
                        break;
                    }
                }

                centroids = newCentroids;
                nb_iters++;

                if (nb_iters > 200) {
                    repeat = false;
                }
            }

            // finished k-means clustering
            // the next part is borrowed from gabrielflor.it
            var kClusters = {};
            for (var j$5 = 0; j$5 < num; j$5++) {
                kClusters[j$5] = [];
            }
            for (var i$6 = 0; i$6 < n; i$6++) {
                cluster = assignments[i$6];
                kClusters[cluster].push(values[i$6]);
            }
            var tmpKMeansBreaks = [];
            for (var j$6 = 0; j$6 < num; j$6++) {
                tmpKMeansBreaks.push(kClusters[j$6][0]);
                tmpKMeansBreaks.push(kClusters[j$6][kClusters[j$6].length - 1]);
            }
            tmpKMeansBreaks = tmpKMeansBreaks.sort(function (a, b) { return a - b; });
            limits.push(tmpKMeansBreaks[0]);
            for (var i$7 = 1; i$7 < tmpKMeansBreaks.length; i$7 += 2) {
                var v = tmpKMeansBreaks[i$7];
                if (!isNaN(v) && limits.indexOf(v) === -1) {
                    limits.push(v);
                }
            }
        }
        return limits;
    }

    function contrast (a, b) {
        // WCAG contrast ratio
        // see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
        a = new Color(a);
        b = new Color(b);
        var l1 = a.luminance();
        var l2 = b.luminance();
        return l1 > l2 ? (l1 + 0.05) / (l2 + 0.05) : (l2 + 0.05) / (l1 + 0.05);
    }

    /**
     * @license
     *
     * The APCA contrast prediction algorithm is based of the formulas published
     * in the APCA-1.0.98G specification by Myndex. The specification is available at:
     * https://raw.githubusercontent.com/Myndex/apca-w3/master/images/APCAw3_0.1.17_APCA0.0.98G.svg
     *
     * Note that the APCA implementation is still beta, so please update to
     * future versions of chroma.js when they become available.
     *
     * You can read more about the APCA Readability Criterion at
     * https://readtech.org/ARC/
     */

    // constants
    var W_offset = 0.027;
    var P_in = 0.0005;
    var P_out = 0.1;
    var R_scale = 1.14;
    var B_threshold = 0.022;
    var B_exp = 1.414;

    function contrastAPCA (text, bg) {
        // parse input colors
        text = new Color(text);
        bg = new Color(bg);
        // if text color has alpha, blend against background
        if (text.alpha() < 1) {
            text = mix(bg, text, text.alpha(), 'rgb');
        }
        var l_text = lum.apply(void 0, text.rgb());
        var l_bg = lum.apply(void 0, bg.rgb());

        // soft clamp black levels
        var Y_text =
            l_text >= B_threshold
                ? l_text
                : l_text + Math.pow(B_threshold - l_text, B_exp);
        var Y_bg =
            l_bg >= B_threshold ? l_bg : l_bg + Math.pow(B_threshold - l_bg, B_exp);

        // normal polarity (dark text on light background)
        var S_norm = Math.pow(Y_bg, 0.56) - Math.pow(Y_text, 0.57);
        // reverse polarity (light text on dark background)
        var S_rev = Math.pow(Y_bg, 0.65) - Math.pow(Y_text, 0.62);
        // clamp noise then scale
        var C =
            Math.abs(Y_bg - Y_text) < P_in
                ? 0
                : Y_text < Y_bg
                  ? S_norm * R_scale
                  : S_rev * R_scale;
        // clamp minimum contrast then offset
        var S_apc = Math.abs(C) < P_out ? 0 : C > 0 ? C - W_offset : C + W_offset;
        // scale to 100
        return S_apc * 100;
    }
    function lum(r, g, b) {
        return (
            0.2126729 * Math.pow(r / 255, 2.4) +
            0.7151522 * Math.pow(g / 255, 2.4) +
            0.072175 * Math.pow(b / 255, 2.4)
        );
    }

    var sqrt = Math.sqrt;
    var pow = Math.pow;
    var min = Math.min;
    var max = Math.max;
    var atan2 = Math.atan2;
    var abs = Math.abs;
    var cos = Math.cos;
    var sin = Math.sin;
    var exp = Math.exp;
    var PI = Math.PI;

    function deltaE (a, b, Kl, Kc, Kh) {
        if ( Kl === void 0 ) Kl = 1;
        if ( Kc === void 0 ) Kc = 1;
        if ( Kh === void 0 ) Kh = 1;

        // Delta E (CIE 2000)
        // see http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CIE2000.html
        var rad2deg = function (rad) {
            return (360 * rad) / (2 * PI);
        };
        var deg2rad = function (deg) {
            return (2 * PI * deg) / 360;
        };
        a = new Color(a);
        b = new Color(b);
        var ref = Array.from(a.lab());
        var L1 = ref[0];
        var a1 = ref[1];
        var b1 = ref[2];
        var ref$1 = Array.from(b.lab());
        var L2 = ref$1[0];
        var a2 = ref$1[1];
        var b2 = ref$1[2];
        var avgL = (L1 + L2) / 2;
        var C1 = sqrt(pow(a1, 2) + pow(b1, 2));
        var C2 = sqrt(pow(a2, 2) + pow(b2, 2));
        var avgC = (C1 + C2) / 2;
        var G = 0.5 * (1 - sqrt(pow(avgC, 7) / (pow(avgC, 7) + pow(25, 7))));
        var a1p = a1 * (1 + G);
        var a2p = a2 * (1 + G);
        var C1p = sqrt(pow(a1p, 2) + pow(b1, 2));
        var C2p = sqrt(pow(a2p, 2) + pow(b2, 2));
        var avgCp = (C1p + C2p) / 2;
        var arctan1 = rad2deg(atan2(b1, a1p));
        var arctan2 = rad2deg(atan2(b2, a2p));
        var h1p = arctan1 >= 0 ? arctan1 : arctan1 + 360;
        var h2p = arctan2 >= 0 ? arctan2 : arctan2 + 360;
        var avgHp =
            abs(h1p - h2p) > 180 ? (h1p + h2p + 360) / 2 : (h1p + h2p) / 2;
        var T =
            1 -
            0.17 * cos(deg2rad(avgHp - 30)) +
            0.24 * cos(deg2rad(2 * avgHp)) +
            0.32 * cos(deg2rad(3 * avgHp + 6)) -
            0.2 * cos(deg2rad(4 * avgHp - 63));
        var deltaHp = h2p - h1p;
        deltaHp =
            abs(deltaHp) <= 180
                ? deltaHp
                : h2p <= h1p
                  ? deltaHp + 360
                  : deltaHp - 360;
        deltaHp = 2 * sqrt(C1p * C2p) * sin(deg2rad(deltaHp) / 2);
        var deltaL = L2 - L1;
        var deltaCp = C2p - C1p;
        var sl = 1 + (0.015 * pow(avgL - 50, 2)) / sqrt(20 + pow(avgL - 50, 2));
        var sc = 1 + 0.045 * avgCp;
        var sh = 1 + 0.015 * avgCp * T;
        var deltaTheta = 30 * exp(-pow((avgHp - 275) / 25, 2));
        var Rc = 2 * sqrt(pow(avgCp, 7) / (pow(avgCp, 7) + pow(25, 7)));
        var Rt = -Rc * sin(2 * deg2rad(deltaTheta));
        var result = sqrt(
            pow(deltaL / (Kl * sl), 2) +
                pow(deltaCp / (Kc * sc), 2) +
                pow(deltaHp / (Kh * sh), 2) +
                Rt * (deltaCp / (Kc * sc)) * (deltaHp / (Kh * sh))
        );
        return max(0, min(100, result));
    }

    // simple Euclidean distance
    function distance (a, b, mode) {
        if ( mode === void 0 ) mode = 'lab';

        // Delta E (CIE 1976)
        // see http://www.brucelindbloom.com/index.html?Equations.html
        a = new Color(a);
        b = new Color(b);
        var l1 = a.get(mode);
        var l2 = b.get(mode);
        var sum_sq = 0;
        for (var i in l1) {
            var d = (l1[i] || 0) - (l2[i] || 0);
            sum_sq += d * d;
        }
        return Math.sqrt(sum_sq);
    }

    function valid () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        try {
            new (Function.prototype.bind.apply( Color, [ null ].concat( args) ));
            return true;
            // eslint-disable-next-line
        } catch (e) {
            return false;
        }
    }

    // some pre-defined color scales:

    var scales = {
        cool: function cool() {
            return scale([chroma.hsl(180, 1, 0.9), chroma.hsl(250, 0.7, 0.4)]);
        },
        hot: function hot() {
            return scale(['#000', '#f00', '#ff0', '#fff']).mode(
                'rgb'
            );
        }
    };

    /**
        ColorBrewer colors for chroma.js

        Copyright (c) 2002 Cynthia Brewer, Mark Harrower, and The
        Pennsylvania State University.

        Licensed under the Apache License, Version 2.0 (the "License");
        you may not use this file except in compliance with the License.
        You may obtain a copy of the License at
        http://www.apache.org/licenses/LICENSE-2.0

        Unless required by applicable law or agreed to in writing, software distributed
        under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
        CONDITIONS OF ANY KIND, either express or implied. See the License for the
        specific language governing permissions and limitations under the License.
    */

    var colorbrewer = {
        // sequential
        OrRd: ['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000'],
        PuBu: ['#fff7fb', '#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#045a8d', '#023858'],
        BuPu: ['#f7fcfd', '#e0ecf4', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#810f7c', '#4d004b'],
        Oranges: ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704'],
        BuGn: ['#f7fcfd', '#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b'],
        YlOrBr: ['#ffffe5', '#fff7bc', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#993404', '#662506'],
        YlGn: ['#ffffe5', '#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#006837', '#004529'],
        Reds: ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'],
        RdPu: ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a'],
        Greens: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
        YlGnBu: ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58'],
        Purples: ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d'],
        GnBu: ['#f7fcf0', '#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#0868ac', '#084081'],
        Greys: ['#ffffff', '#f0f0f0', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525', '#000000'],
        YlOrRd: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'],
        PuRd: ['#f7f4f9', '#e7e1ef', '#d4b9da', '#c994c7', '#df65b0', '#e7298a', '#ce1256', '#980043', '#67001f'],
        Blues: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
        PuBuGn: ['#fff7fb', '#ece2f0', '#d0d1e6', '#a6bddb', '#67a9cf', '#3690c0', '#02818a', '#016c59', '#014636'],
        Viridis: ['#440154', '#482777', '#3f4a8a', '#31678e', '#26838f', '#1f9d8a', '#6cce5a', '#b6de2b', '#fee825'],

        // diverging
        Spectral: ['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2'],
        RdYlGn: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#006837'],
        RdBu: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061'],
        PiYG: ['#8e0152', '#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#f7f7f7', '#e6f5d0', '#b8e186', '#7fbc41', '#4d9221', '#276419'],
        PRGn: ['#40004b', '#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#a6dba0', '#5aae61', '#1b7837', '#00441b'],
        RdYlBu: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'],
        BrBG: ['#543005', '#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#f5f5f5', '#c7eae5', '#80cdc1', '#35978f', '#01665e', '#003c30'],
        RdGy: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#ffffff', '#e0e0e0', '#bababa', '#878787', '#4d4d4d', '#1a1a1a'],
        PuOr: ['#7f3b08', '#b35806', '#e08214', '#fdb863', '#fee0b6', '#f7f7f7', '#d8daeb', '#b2abd2', '#8073ac', '#542788', '#2d004b'],

        // qualitative
        Set2: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3'],
        Accent: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17', '#666666'],
        Set1: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'],
        Set3: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f'],
        Dark2: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666'],
        Paired: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'],
        Pastel2: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae', '#f1e2cc', '#cccccc'],
        Pastel1: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd', '#fddaec', '#f2f2f2']
    };

    var colorbrewerTypes = Object.keys(colorbrewer);
    var typeMap = new Map(colorbrewerTypes.map(function (key) { return [key.toLowerCase(), key]; }));

    // use Proxy to allow case-insensitive access to palettes
    var colorbrewerProxy =
        typeof Proxy === 'function'
            ? new Proxy(colorbrewer, {
                  get: function get(target, prop) {
                      var lower = prop.toLowerCase();
                      if (typeMap.has(lower)) {
                          return target[typeMap.get(lower)];
                      }
                  },
                  getOwnPropertyNames: function getOwnPropertyNames() {
                      return Object.getOwnPropertyNames(colorbrewerTypes);
                  }
              })
            : colorbrewer;

    // feel free to comment out anything to rollup
    // a smaller chroma.js bundle

    Object.assign(chroma, {
        analyze: analyze,
        average: average,
        bezier: bezier$1,
        blend: blend,
        brewer: colorbrewerProxy,
        Color: Color,
        colors: w3cx11,
        contrast: contrast,
        contrastAPCA: contrastAPCA,
        cubehelix: cubehelix,
        deltaE: deltaE,
        distance: distance,
        input: input,
        interpolate: mix,
        limits: limits,
        mix: mix,
        random: random$1,
        scale: scale,
        scales: scales,
        valid: valid,
        cmyk: cmyk,
        css: css,
        gl: gl,
        hcg: hcg$1,
        hex: hex,
        hsi: hsi$1,
        hsl: hsl$1,
        hsv: hsv$1,
        lab: lab$1,
        lch: lch$1,
        hcl: hcl,
        num: num$1,
        rgb: rgb$1,
        temp: temp,
        kelvin: temp,
        temperature: temp,
        oklab: oklab$1,
        oklch: oklch$1,
        getLabWhitePoint: getLabWhitePoint,
        setLabWhitePoint: setLabWhitePoint
    });

    return chroma;

}));
