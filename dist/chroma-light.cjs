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

    var min$1 = Math.min;
    var max$1 = Math.max;

    function limit (x, low, high) {
        if ( high === void 0 ) high = 1;

        return min$1(max$1(low, x), high);
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

    var PI = Math.PI;
    var min = Math.min;
    var max = Math.max;

    var rnd2 = function (a) { return Math.round(a * 100) / 100; };
    var rnd3 = function (a) { return Math.round(a * 100) / 100; };
    var DEG2RAD = PI / 180;
    var RAD2DEG = 180 / PI;

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
    var rgb2hsl = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack(args, 'rgba');
        var r = args[0];
        var g = args[1];
        var b = args[2];

        r /= 255;
        g /= 255;
        b /= 255;

        var minRgb = min(r, g, b);
        var maxRgb = max(r, g, b);

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

    var sqrt$1 = Math.sqrt;
    var atan2 = Math.atan2;
    var round$4 = Math.round;

    var lab2lch = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack(args, 'lab');
        var l = ref[0];
        var a = ref[1];
        var b = ref[2];
        var c = sqrt$1(a * a + b * b);
        var h = (atan2(b, a) * RAD2DEG + 360) % 360;
        if (round$4(c * 10000) === 0) { h = Number.NaN; }
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

    var round$3 = Math.round;

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
            return hsl2css(rgb2hsl(rgba), mode);
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
        rgba[0] = round$3(rgba[0]);
        rgba[1] = round$3(rgba[1]);
        rgba[2] = round$3(rgba[2]);
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

    var sin = Math.sin;
    var cos = Math.cos;

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
        return [l, cos(h) * c, sin(h) * c];
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

    var round$2 = Math.round;

    var roundRGB = function (rgb) {
        return rgb.map(function (v, i) { return (i <= 2 ? limit(round$2(v), 0, 255) : v); });
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
                rgb$3[i$2] = round$2(rgb$3[i$2]);
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

    var round$1 = Math.round;

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
        r = round$1(r);
        g = round$1(g);
        b = round$1(b);
        var u = (r << 16) | (g << 8) | b;
        var str = '000000' + u.toString(16); //#.toUpperCase();
        str = str.substr(str.length - 6);
        var hxa = '0' + round$1(a * 255).toString(16);
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

    Color.prototype.hsl = function () {
        return rgb2hsl(this._rgb);
    };

    var hsl = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color, [ null ].concat( args, ['hsl']) ));
    };
    chroma.hsl = hsl;

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

    Color.prototype.lab = function () {
        return rgb2lab(this._rgb);
    };

    var lab = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color, [ null ].concat( args, ['lab']) ));
    };
    Object.assign(chroma, { lab: lab, getLabWhitePoint: getLabWhitePoint, setLabWhitePoint: setLabWhitePoint });

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

    var round = Math.round;

    Color.prototype.rgb = function (rnd) {
        if ( rnd === void 0 ) rnd = true;

        if (rnd === false) { return this._rgb.slice(0, 3); }
        return this._rgb.slice(0, 3).map(round);
    };

    Color.prototype.rgba = function (rnd) {
        if ( rnd === void 0 ) rnd = true;

        return this._rgb.slice(0, 4).map(function (v, i) {
            return i < 3 ? (rnd === false ? v : round(v)) : v;
        });
    };

    var rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color, [ null ].concat( args, ['rgb']) ));
    };
    Object.assign(chroma, { rgb: rgb });

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

    var sqrt = Math.sqrt;
    var pow = Math.pow;

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
            sqrt(pow(x1, 2) * (1 - f) + pow(x2, 2) * f),
            sqrt(pow(y1, 2) * (1 - f) + pow(y2, 2) * f),
            sqrt(pow(z1, 2) * (1 - f) + pow(z2, 2) * f),
            'rgb'
        );
    };

    // register interpolator
    index.lrgb = lrgb;

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

    Object.assign(chroma, {
        Color: Color,
        valid: valid,
        css: css,
        hex: hex,
        hsl: hsl,
        lab: lab,
        oklab: oklab$1,
        rgb: rgb,
        mix: mix,
        interpolate: mix
    });

    return chroma;

}));
