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

(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
})((function () { 'use strict';

    function limit (x, low, high) {
        if ( high === void 0 ) high = 1;

        return min(max(low, x), high);
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
        return args[0];
    }

    function last (args) {
        if (args.length < 2) { return null; }
        var l = args.length - 1;
        if (type(args[l]) == 'string') { return args[l].toLowerCase(); }
        return null;
    }

    var min = Math.min;
    var max = Math.max;

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
    var version = '2.6.0';

    var chroma = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( chroma.Color, [ null ].concat( args) ));
    };

    chroma.Color = Color;
    chroma.version = version;

    var rnd = function (a) { return Math.round(a * 100) / 100; };

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
        hsla[0] = rnd(hsla[0] || 0);
        hsla[1] = rnd(hsla[1] * 100) + '%';
        hsla[2] = rnd(hsla[2] * 100) + '%';
        if (mode === 'hsla' || (hsla.length > 3 && hsla[3] < 1)) {
            hsla[3] = hsla.length > 3 ? hsla[3] : 1;
            mode = 'hsla';
        } else {
            hsla.length = 3;
        }
        return (mode + "(" + (hsla.join(',')) + ")");
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
        if (mode.substr(0, 3) == 'hsl') {
            return hsl2css(rgb2hsl(rgba), mode);
        }
        rgba[0] = round$4(rgba[0]);
        rgba[1] = round$4(rgba[1]);
        rgba[2] = round$4(rgba[2]);
        if (mode === 'rgba' || (rgba.length > 3 && rgba[3] < 1)) {
            rgba[3] = rgba.length > 3 ? rgba[3] : 1;
            mode = 'rgba';
        }
        return (mode + "(" + (rgba.slice(0, mode === 'rgb' ? 3 : 4).join(',')) + ")");
    };

    var round$3 = Math.round;

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
            (assign = [round$3(c[0] * 255), round$3(c[1] * 255), round$3(c[2] * 255)], r = assign[0], g = assign[1], b = assign[2]);
        }
        if (args.length > 3) {
            // keep alpha channel
            return [r, g, b, args[3]];
        }
        return [r, g, b, 1];
    };

    var RE_RGB = /^rgb\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*\)$/;
    var RE_RGBA =
        /^rgba\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*([01]|[01]?\.\d+)\)$/;
    var RE_RGB_PCT =
        /^rgb\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/;
    var RE_RGBA_PCT =
        /^rgba\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/;
    var RE_HSL =
        /^hsl\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/;
    var RE_HSLA =
        /^hsla\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/;

    var round$2 = Math.round;

    var css2rgb = function (css) {
        css = css.toLowerCase().trim();
        var m;

        if (input.format.named) {
            try {
                return input.format.named(css);
                // eslint-disable-next-line
            } catch (e) {}
        }

        // rgb(250,20,0)
        if ((m = css.match(RE_RGB))) {
            var rgb = m.slice(1, 4);
            for (var i = 0; i < 3; i++) {
                rgb[i] = +rgb[i];
            }
            rgb[3] = 1; // default alpha
            return rgb;
        }

        // rgba(250,20,0,0.4)
        if ((m = css.match(RE_RGBA))) {
            var rgb$1 = m.slice(1, 5);
            for (var i$1 = 0; i$1 < 4; i$1++) {
                rgb$1[i$1] = +rgb$1[i$1];
            }
            return rgb$1;
        }

        // rgb(100%,0%,0%)
        if ((m = css.match(RE_RGB_PCT))) {
            var rgb$2 = m.slice(1, 4);
            for (var i$2 = 0; i$2 < 3; i$2++) {
                rgb$2[i$2] = round$2(rgb$2[i$2] * 2.55);
            }
            rgb$2[3] = 1; // default alpha
            return rgb$2;
        }

        // rgba(100%,0%,0%,0.4)
        if ((m = css.match(RE_RGBA_PCT))) {
            var rgb$3 = m.slice(1, 5);
            for (var i$3 = 0; i$3 < 3; i$3++) {
                rgb$3[i$3] = round$2(rgb$3[i$3] * 2.55);
            }
            rgb$3[3] = +rgb$3[3];
            return rgb$3;
        }

        // hsl(0,100%,50%)
        if ((m = css.match(RE_HSL))) {
            var hsl = m.slice(1, 4);
            hsl[1] *= 0.01;
            hsl[2] *= 0.01;
            var rgb$4 = hsl2rgb(hsl);
            rgb$4[3] = 1;
            return rgb$4;
        }

        // hsla(0,100%,50%,0.5)
        if ((m = css.match(RE_HSLA))) {
            var hsl$1 = m.slice(1, 4);
            hsl$1[1] *= 0.01;
            hsl$1[2] *= 0.01;
            var rgb$5 = hsl2rgb(hsl$1);
            rgb$5[3] = +m[4]; // default alpha = 1
            return rgb$5;
        }
    };

    css2rgb.test = function (s) {
        return (
            RE_RGB.test(s) ||
            RE_RGBA.test(s) ||
            RE_RGB_PCT.test(s) ||
            RE_RGBA_PCT.test(s) ||
            RE_HSL.test(s) ||
            RE_HSLA.test(s)
        );
    };

    Color.prototype.css = function (mode) {
        return rgb2css(this._rgb, mode);
    };

    chroma.css = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color, [ null ].concat( args, ['css']) ));
    };

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

    chroma.hex = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color, [ null ].concat( args, ['hex']) ));
    };

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

    chroma.hsl = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color, [ null ].concat( args, ['hsl']) ));
    };

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

    var LAB_CONSTANTS = {
        // Corresponds roughly to RGB brighter/darker
        Kn: 18,

        // D65 standard referent
        Xn: 0.95047,
        Yn: 1,
        Zn: 1.08883,

        t0: 0.137931034, // 4 / 29
        t1: 0.206896552, // 6 / 29
        t2: 0.12841855, // 3 * t1 * t1
        t3: 0.008856452 // t1 * t1 * t1
    };

    var pow$4 = Math.pow;

    /*
     * L* [0..100]
     * a [-100..100]
     * b [-100..100]
     */
    var lab2rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack(args, 'lab');
        var l = args[0];
        var a = args[1];
        var b = args[2];
        var x, y, z, r, g, b_;

        y = (l + 16) / 116;
        x = isNaN(a) ? y : y + a / 500;
        z = isNaN(b) ? y : y - b / 200;

        y = LAB_CONSTANTS.Yn * lab_xyz(y);
        x = LAB_CONSTANTS.Xn * lab_xyz(x);
        z = LAB_CONSTANTS.Zn * lab_xyz(z);

        r = xyz_rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z); // D65 -> sRGB
        g = xyz_rgb(-0.969266 * x + 1.8760108 * y + 0.041556 * z);
        b_ = xyz_rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z);

        return [r, g, b_, args.length > 3 ? args[3] : 1];
    };

    var xyz_rgb = function (r) {
        return 255 * (r <= 0.00304 ? 12.92 * r : 1.055 * pow$4(r, 1 / 2.4) - 0.055);
    };

    var lab_xyz = function (t) {
        return t > LAB_CONSTANTS.t1
            ? t * t * t
            : LAB_CONSTANTS.t2 * (t - LAB_CONSTANTS.t0);
    };

    var pow$3 = Math.pow;

    var rgb2lab = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var ref$1 = rgb2xyz(r, g, b);
        var x = ref$1[0];
        var y = ref$1[1];
        var z = ref$1[2];
        var l = 116 * y - 16;
        return [l < 0 ? 0 : l, 500 * (x - y), 200 * (y - z)];
    };

    var rgb_xyz = function (r) {
        if ((r /= 255) <= 0.04045) { return r / 12.92; }
        return pow$3((r + 0.055) / 1.055, 2.4);
    };

    var xyz_lab = function (t) {
        if (t > LAB_CONSTANTS.t3) { return pow$3(t, 1 / 3); }
        return t / LAB_CONSTANTS.t2 + LAB_CONSTANTS.t0;
    };

    var rgb2xyz = function (r, g, b) {
        r = rgb_xyz(r);
        g = rgb_xyz(g);
        b = rgb_xyz(b);
        var x = xyz_lab(
            (0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / LAB_CONSTANTS.Xn
        );
        var y = xyz_lab(
            (0.2126729 * r + 0.7151522 * g + 0.072175 * b) / LAB_CONSTANTS.Yn
        );
        var z = xyz_lab(
            (0.0193339 * r + 0.119192 * g + 0.9503041 * b) / LAB_CONSTANTS.Zn
        );
        return [x, y, z];
    };

    Color.prototype.lab = function () {
        return rgb2lab(this._rgb);
    };

    chroma.lab = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color, [ null ].concat( args, ['lab']) ));
    };

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

    var pow$2 = Math.pow;
    var sign$1 = Math.sign;

    /*
     * L* [0..100]
     * a [-100..100]
     * b [-100..100]
     */
    var oklab2rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack(args, 'lab');
        var L = args[0];
        var a = args[1];
        var b = args[2];

        var l = pow$2(L + 0.3963377774 * a + 0.2158037573 * b, 3);
        var m = pow$2(L - 0.1055613458 * a - 0.0638541728 * b, 3);
        var s = pow$2(L - 0.0894841775 * a - 1.291485548 * b, 3);

        return [
            255 * lrgb2rgb(+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
            255 * lrgb2rgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
            255 * lrgb2rgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
            args.length > 3 ? args[3] : 1
        ];
    };

    function lrgb2rgb(c) {
        var abs = Math.abs(c);
        if (abs > 0.0031308) {
            return (sign$1(c) || 1) * (1.055 * pow$2(abs, 1 / 2.4) - 0.055);
        }
        return c * 12.92;
    }

    var cbrt = Math.cbrt;
    var pow$1 = Math.pow;
    var sign = Math.sign;

    var rgb2oklab = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        // OKLab color space implementation taken from
        // https://bottosson.github.io/posts/oklab/
        var ref = unpack(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var ref$1 = [
            rgb2lrgb(r / 255),
            rgb2lrgb(g / 255),
            rgb2lrgb(b / 255)
        ];
        var lr = ref$1[0];
        var lg = ref$1[1];
        var lb = ref$1[2];
        var l = cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
        var m = cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
        var s = cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

        return [
            0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
            1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
            0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
        ];
    };

    function rgb2lrgb(c) {
        var abs = Math.abs(c);
        if (abs < 0.04045) {
            return c / 12.92;
        }
        return (sign(c) || 1) * pow$1((abs + 0.055) / 1.055, 2.4);
    }

    Color.prototype.oklab = function () {
        return rgb2oklab(this._rgb);
    };

    chroma.oklab = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color, [ null ].concat( args, ['oklab']) ));
    };

    input.format.oklab = oklab2rgb;

    input.autodetect.push({
        p: 3,
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

    chroma.rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color, [ null ].concat( args, ['rgb']) ));
    };

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
        lab[0] -= LAB_CONSTANTS.Kn * amount;
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

    // generators -- > create new colors
    chroma.mix = chroma.interpolate = require('./src/generator/mix');

    // other utility methods
    chroma.valid = require('./src/utils/valid');

    module.exports = chroma;

}));
