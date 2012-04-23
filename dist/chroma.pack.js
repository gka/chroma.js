(function() {

  /**
      chroma.js - a neat JS lib for color conversions
      Copyright (C) 2011  Gregor Aisch
  
  	The JavaScript code in this page is free software: you can
      redistribute it and/or modify it under the terms of the GNU
      General Public License (GNU GPL) as published by the Free Software
      Foundation, either version 3 of the License, or (at your option)
      any later version.  The code is distributed WITHOUT ANY WARRANTY;
      without even the implied warranty of MERCHANTABILITY or FITNESS
      FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
  
      As additional permission under GNU GPL version 3 section 7, you
      may distribute non-source (e.g., minimized or compacted) forms of
      that code without the copy of the GNU GPL normally required by
      section 4, provided you include this license notice and a URL
      through which recipients can access the Corresponding Source.
  
      @source: https://github.com/gka/chroma.js
  */

  var CSSColors, Categories, Color, ColorScale, Diverging, Ramp, brewer, chroma, colors, root, type, _ref, _ref2, _ref3, _ref4, _ref5;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  chroma = (_ref = root.chroma) != null ? _ref : root.chroma = {};

  if (typeof module !== "undefined" && module !== null) module.exports = chroma;

  chroma.version = "0.3.0";

  Color = (function() {

    /*
    	data type for colors
    
    	eg.
    	new Color() // white
    	new Color(120,.8,.5) // defaults to hsl color
    	new Color([120,.8,.5]) // this also works
    	new Color(255,100,50,'rgb') //  color using RGB
    	new Color('#ff0000') // or hex value
    */

    function Color(x, y, z, m) {
      var me, _ref2;
      me = this;
      if (!(x != null) && !(y != null) && !(z != null) && !(m != null)) {
        x = [255, 0, 255];
      }
      if (type(x) === "array" && x.length === 3) {
        if (m == null) m = y;
        _ref2 = x, x = _ref2[0], y = _ref2[1], z = _ref2[2];
      }
      if (type(x) === "string") {
        m = 'hex';
      } else {
        if (m == null) m = 'rgb';
      }
      if (m === 'rgb') {
        me.rgb = [x, y, z];
      } else if (m === 'hsl') {
        me.rgb = Color.hsl2rgb(x, y, z);
      } else if (m === 'hsv') {
        me.rgb = Color.hsv2rgb(x, y, z);
      } else if (m === 'hex') {
        me.rgb = Color.hex2rgb(x);
      } else if (m === 'lab') {
        me.rgb = Color.lab2rgb(x, y, z);
      } else if (m === 'hcl') {
        me.rgb = Color.hcl2rgb(x, y, z);
      } else if (m === 'hsi') {
        me.rgb = Color.hsi2rgb(x, y, z);
      }
    }

    Color.prototype.hex = function() {
      return Color.rgb2hex(this.rgb);
    };

    Color.prototype.toString = function() {
      return this.hex();
    };

    Color.prototype.hsl = function() {
      return Color.rgb2hsl(this.rgb);
    };

    Color.prototype.hsv = function() {
      return Color.rgb2hsv(this.rgb);
    };

    Color.prototype.lab = function() {
      return Color.rgb2lab(this.rgb);
    };

    Color.prototype.hcl = function() {
      return Color.rgb2hcl(this.rgb);
    };

    Color.prototype.hsi = function() {
      return Color.rgb2hsi(this.rgb);
    };

    Color.prototype.interpolate = function(f, col, m) {
      /*
      		interpolates between colors
      */
      var dh, hue, hue0, hue1, lbv, lbv0, lbv1, me, sat, sat0, sat1, xyz0, xyz1;
      me = this;
      if (m == null) m = 'rgb';
      if (type(col) === "string") col = new Color(col);
      if (m === 'hsl' || m === 'hsv' || m === 'hcl' || m === 'hsi') {
        if (m === 'hsl') {
          xyz0 = me.hsl();
          xyz1 = col.hsl();
        } else if (m === 'hsv') {
          xyz0 = me.hsv();
          xyz1 = col.hsv();
        } else if (m === 'hcl') {
          xyz0 = me.hcl();
          xyz1 = col.hcl();
        } else if (m === 'hsi') {
          xyz0 = me.hsi();
          xyz1 = col.hsi();
        }
        hue0 = xyz0[0], sat0 = xyz0[1], lbv0 = xyz0[2];
        hue1 = xyz1[0], sat1 = xyz1[1], lbv1 = xyz1[2];
        if (!isNaN(hue0) && !isNaN(hue1)) {
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
          if (lbv1 === 1 || lbv1 === 0) sat = sat0;
        } else if (!isNaN(hue1)) {
          hue = hue1;
          if (lbv0 === 1 || lbv0 === 0) sat = sat1;
        } else {
          hue = void 0;
        }
        if (sat == null) sat = sat0 + f * (sat1 - sat0);
        lbv = lbv0 + f * (lbv1 - lbv0);
        return new Color(hue, sat, lbv, m);
      } else if (m === 'rgb') {
        xyz0 = me.rgb;
        xyz1 = col.rgb;
        return new Color(xyz0[0] + f * (xyz1[0] - xyz0[0]), xyz0[1] + f * (xyz1[1] - xyz0[1]), xyz0[2] + f * (xyz1[2] - xyz0[2]), m);
      } else if (m === 'lab') {
        xyz0 = me.lab();
        xyz1 = col.lab();
        return new Color(xyz0[0] + f * (xyz1[0] - xyz0[0]), xyz0[1] + f * (xyz1[1] - xyz0[1]), xyz0[2] + f * (xyz1[2] - xyz0[2]), m);
      } else {
        throw "color mode " + m + " is not supported";
      }
    };

    return Color;

  })();

  Color.hex2rgb = function(hex) {
    var b, g, r, u;
    if (!hex.match(/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
      if ((chroma.colors != null) && chroma.colors[hex]) {
        hex = chroma.colors[hex];
      } else {
        throw "unknown color format: " + hex;
      }
    }
    if (hex.length === 4 || hex.length === 7) hex = hex.substr(1);
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    u = parseInt(hex, 16);
    r = u >> 16;
    g = u >> 8 & 0xFF;
    b = u & 0xFF;
    return [r, g, b];
  };

  Color.rgb2hex = function(r, g, b) {
    var str, u, _ref2;
    if (r !== void 0 && r.length === 3) {
      _ref2 = r, r = _ref2[0], g = _ref2[1], b = _ref2[2];
    }
    u = r << 16 | g << 8 | b;
    str = "000000" + u.toString(16).toUpperCase();
    return "#" + str.substr(str.length - 6);
  };

  Color.hsv2rgb = function(h, s, v) {
    var b, f, g, i, l, p, q, r, t, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
    if (type(h) === "array" && h.length === 3) {
      _ref2 = h, h = _ref2[0], s = _ref2[1], l = _ref2[2];
    }
    v *= 255;
    if (s === 0 && isNaN(h)) {
      r = g = b = v;
    } else {
      if (h === 360) h = 0;
      if (h > 360) h -= 360;
      if (h < 0) h += 360;
      h /= 60;
      i = Math.floor(h);
      f = h - i;
      p = v * (1 - s);
      q = v * (1 - s * f);
      t = v * (1 - s * (1 - f));
      switch (i) {
        case 0:
          _ref3 = [v, t, p], r = _ref3[0], g = _ref3[1], b = _ref3[2];
          break;
        case 1:
          _ref4 = [q, v, p], r = _ref4[0], g = _ref4[1], b = _ref4[2];
          break;
        case 2:
          _ref5 = [p, v, t], r = _ref5[0], g = _ref5[1], b = _ref5[2];
          break;
        case 3:
          _ref6 = [p, q, v], r = _ref6[0], g = _ref6[1], b = _ref6[2];
          break;
        case 4:
          _ref7 = [t, p, v], r = _ref7[0], g = _ref7[1], b = _ref7[2];
          break;
        case 5:
          _ref8 = [v, p, q], r = _ref8[0], g = _ref8[1], b = _ref8[2];
      }
    }
    r = Math.round(r);
    g = Math.round(g);
    b = Math.round(b);
    return [r, g, b];
  };

  Color.rgb2hsv = function(r, g, b) {
    var delta, h, max, min, s, v, _ref2;
    if (r !== void 0 && r.length === 3) {
      _ref2 = r, r = _ref2[0], g = _ref2[1], b = _ref2[2];
    }
    min = Math.min(r, g, b);
    max = Math.max(r, g, b);
    delta = max - min;
    v = max / 255.0;
    s = delta / max;
    if (s === 0) {
      h = void 0;
      s = 0;
    } else {
      if (r === max) h = (g - b) / delta;
      if (g === max) h = 2 + (b - r) / delta;
      if (b === max) h = 4 + (r - g) / delta;
      h *= 60;
      if (h < 0) h += 360;
    }
    return [h, s, v];
  };

  Color.hsl2rgb = function(h, s, l) {
    var b, c, g, i, r, t1, t2, t3, _ref2, _ref3;
    if (h !== void 0 && h.length === 3) {
      _ref2 = h, h = _ref2[0], s = _ref2[1], l = _ref2[2];
    }
    if (s === 0) {
      r = g = b = l * 255;
    } else {
      t3 = [0, 0, 0];
      c = [0, 0, 0];
      t2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
      t1 = 2 * l - t2;
      h /= 360;
      t3[0] = h + 1 / 3;
      t3[1] = h;
      t3[2] = h - 1 / 3;
      for (i = 0; i <= 2; i++) {
        if (t3[i] < 0) t3[i] += 1;
        if (t3[i] > 1) t3[i] -= 1;
        if (6 * t3[i] < 1) {
          c[i] = t1 + (t2 - t1) * 6 * t3[i];
        } else if (2 * t3[i] < 1) {
          c[i] = t2;
        } else if (3 * t3[i] < 2) {
          c[i] = t1 + (t2 - t1) * ((2 / 3) - t3[i]) * 6;
        } else {
          c[i] = t1;
        }
      }
      _ref3 = [Math.round(c[0] * 255), Math.round(c[1] * 255), Math.round(c[2] * 255)], r = _ref3[0], g = _ref3[1], b = _ref3[2];
    }
    return [r, g, b];
  };

  Color.rgb2hsl = function(r, g, b) {
    var h, l, max, min, s, _ref2;
    if (r !== void 0 && r.length === 3) {
      _ref2 = r, r = _ref2[0], g = _ref2[1], b = _ref2[2];
    }
    r /= 255;
    g /= 255;
    b /= 255;
    min = Math.min(r, g, b);
    max = Math.max(r, g, b);
    l = (max + min) / 2;
    if (max === min) {
      s = 0;
      h = void 0;
    } else {
      s = l < 0.5 ? (max - min) / (max + min) : (max - min) / (2 - max - min);
    }
    if (r === max) {
      h = (g - b) / (max - min);
    } else if (g === max) {
      h = 2 + (b - r) / (max - min);
    } else if (b === max) {
      h = 4 + (r - g) / (max - min);
    }
    h *= 60;
    if (h < 0) h += 360;
    return [h, s, l];
  };

  Color.lab2xyz = function(l, a, b) {
    /*
    	Convert from L*a*b* doubles to XYZ doubles
    	Formulas drawn from http://en.wikipedia.org/wiki/Lab_color_spaces
    */
    var finv, ill, sl, x, y, z, _ref2;
    if (type(l) === "array" && l.length === 3) {
      _ref2 = l, l = _ref2[0], a = _ref2[1], b = _ref2[2];
    }
    finv = function(t) {
      if (t > (6.0 / 29.0)) {
        return t * t * t;
      } else {
        return 3 * (6.0 / 29.0) * (6.0 / 29.0) * (t - 4.0 / 29.0);
      }
    };
    sl = (l + 0.16) / 1.16;
    ill = [0.96421, 1.00000, 0.82519];
    y = ill[1] * finv(sl);
    x = ill[0] * finv(sl + (a / 5.0));
    z = ill[2] * finv(sl - (b / 2.0));
    return [x, y, z];
  };

  Color.xyz2rgb = function(x, y, z) {
    /*
    	Convert from XYZ doubles to sRGB bytes
    	Formulas drawn from http://en.wikipedia.org/wiki/Srgb
    */
    var b, bl, clip, correct, g, gl, r, rl, _ref2, _ref3;
    if (type(x) === "array" && x.length === 3) {
      _ref2 = x, x = _ref2[0], y = _ref2[1], z = _ref2[2];
    }
    rl = 3.2406 * x - 1.5372 * y - 0.4986 * z;
    gl = -0.9689 * x + 1.8758 * y + 0.0415 * z;
    bl = 0.0557 * x - 0.2040 * y + 1.0570 * z;
    clip = Math.min(rl, gl, bl) < -0.001 || Math.max(rl, gl, bl) > 1.001;
    if (clip) {
      rl = rl < 0.0 ? 0.0 : rl > 1.0 ? 1.0 : rl;
      gl = gl < 0.0 ? 0.0 : gl > 1.0 ? 1.0 : gl;
      bl = bl < 0.0 ? 0.0 : bl > 1.0 ? 1.0 : bl;
    }
    if (clip) {
      _ref3 = [void 0, void 0, void 0], rl = _ref3[0], gl = _ref3[1], bl = _ref3[2];
    }
    correct = function(cl) {
      var a;
      a = 0.055;
      if (cl <= 0.0031308) {
        return 12.92 * cl;
      } else {
        return (1 + a) * Math.pow(cl, 1 / 2.4) - a;
      }
    };
    r = Math.round(255.0 * correct(rl));
    g = Math.round(255.0 * correct(gl));
    b = Math.round(255.0 * correct(bl));
    return [r, g, b];
  };

  Color.lab2rgb = function(l, a, b) {
    /*
    	Convert from LAB doubles to sRGB bytes
    	(just composing the above transforms)
    */
    var x, y, z, _ref2, _ref3, _ref4;
    if (l !== void 0 && l.length === 3) {
      _ref2 = l, l = _ref2[0], a = _ref2[1], b = _ref2[2];
    }
    if (l !== void 0 && l.length === 3) {
      _ref3 = l, l = _ref3[0], a = _ref3[1], b = _ref3[2];
    }
    _ref4 = Color.lab2xyz(l, a, b), x = _ref4[0], y = _ref4[1], z = _ref4[2];
    return Color.xyz2rgb(x, y, z);
  };

  Color.hcl2lab = function(c, s, l) {
    /*
    	Convert from a qualitative parameter c and a quantitative parameter l to a 24-bit pixel. These formulas were invented by David Dalrymple to obtain maximum contrast without going out of gamut if the parameters are in the range 0-1.
    
    	A saturation multiplier was added by Gregor Aisch
    */
    var L, TAU, a, angle, b, r, _ref2;
    if (type(c) === "array" && c.length === 3) {
      _ref2 = c, c = _ref2[0], s = _ref2[1], l = _ref2[2];
    }
    c /= 360.0;
    TAU = 6.283185307179586476925287;
    L = l * 0.61 + 0.09;
    angle = TAU / 6.0 - c * TAU;
    r = (l * 0.311 + 0.125) * s;
    a = Math.sin(angle) * r;
    b = Math.cos(angle) * r;
    return [L, a, b];
  };

  Color.hcl2rgb = function(c, s, l) {
    var L, a, b, _ref2;
    _ref2 = Color.hcl2lab(c, s, l), L = _ref2[0], a = _ref2[1], b = _ref2[2];
    return Color.lab2rgb(L, a, b);
  };

  Color.rgb2xyz = function(r, g, b) {
    var bl, correct, gl, rl, x, y, z, _ref2;
    if (r !== void 0 && r.length === 3) {
      _ref2 = r, r = _ref2[0], g = _ref2[1], b = _ref2[2];
    }
    correct = function(c) {
      var a;
      a = 0.055;
      if (c <= 0.04045) {
        return c / 12.92;
      } else {
        return Math.pow((c + a) / (1 + a), 2.4);
      }
    };
    rl = correct(r / 255.0);
    gl = correct(g / 255.0);
    bl = correct(b / 255.0);
    x = 0.4124 * rl + 0.3576 * gl + 0.1805 * bl;
    y = 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
    z = 0.0193 * rl + 0.1192 * gl + 0.9505 * bl;
    return [x, y, z];
  };

  Color.xyz2lab = function(x, y, z) {
    var a, b, f, ill, l, _ref2;
    if (x !== void 0 && x.length === 3) {
      _ref2 = x, x = _ref2[0], y = _ref2[1], z = _ref2[2];
    }
    ill = [0.96421, 1.00000, 0.82519];
    f = function(t) {
      if (t > Math.pow(6.0 / 29.0, 3)) {
        return Math.pow(t, 1 / 3);
      } else {
        return (1 / 3) * (29 / 6) * (29 / 6) * t + 4.0 / 29.0;
      }
    };
    l = 1.16 * f(y / ill[1]) - 0.16;
    a = 5 * (f(x / ill[0]) - f(y / ill[1]));
    b = 2 * (f(y / ill[1]) - f(z / ill[2]));
    return [l, a, b];
  };

  Color.rgb2lab = function(r, g, b) {
    var x, y, z, _ref2, _ref3;
    if (r !== void 0 && r.length === 3) {
      _ref2 = r, r = _ref2[0], g = _ref2[1], b = _ref2[2];
    }
    _ref3 = Color.rgb2xyz(r, g, b), x = _ref3[0], y = _ref3[1], z = _ref3[2];
    return Color.xyz2lab(x, y, z);
  };

  Color.lab2hcl = function(l, a, b) {
    /*
    	Convert from a qualitative parameter c and a quantitative parameter l to a 24-bit pixel. These formulas were invented by David Dalrymple to obtain maximum contrast without going out of gamut if the parameters are in the range 0-1.
    
    	A saturation multiplier was added by Gregor Aisch
    */
    var L, TAU, angle, c, r, s, _ref2;
    if (type(l) === "array" && l.length === 3) {
      _ref2 = l, l = _ref2[0], a = _ref2[1], b = _ref2[2];
    }
    L = l;
    l = (l - 0.09) / 0.61;
    r = Math.sqrt(a * a + b * b);
    s = r / (l * 0.311 + 0.125);
    TAU = 6.283185307179586476925287;
    angle = Math.atan2(a, b);
    c = (TAU / 6 - angle) / TAU;
    c *= 360;
    if (c < 0) c += 360;
    return [c, s, l];
  };

  Color.rgb2hcl = function(r, g, b) {
    var a, l, _ref2, _ref3;
    if (type(r) === "array" && r.length === 3) {
      _ref2 = r, r = _ref2[0], g = _ref2[1], b = _ref2[2];
    }
    _ref3 = Color.rgb2lab(r, g, b), l = _ref3[0], a = _ref3[1], b = _ref3[2];
    return Color.lab2hcl(l, a, b);
  };

  Color.rgb2hsi = function(r, g, b) {
    /*
    	borrowed from here:
    	http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/rgb2hsi.cpp
    */
    var TWOPI, h, i, min, s, _ref2;
    if (type(r) === "array" && r.length === 3) {
      _ref2 = r, r = _ref2[0], g = _ref2[1], b = _ref2[2];
    }
    TWOPI = Math.PI * 2;
    r /= 255;
    g /= 255;
    b /= 255;
    min = Math.min(r, g, b);
    i = (r + g + b) / 3;
    s = 1 - min / i;
    if (s === 0) {
      h = 0;
    } else {
      h = ((r - g) + (r - b)) / 2;
      h /= Math.sqrt((r - g) * (r - g) + (r - b) * (g - b));
      h = Math.acos(h);
      if (b > g) h = TWOPI - h;
      h /= TWOPI;
    }
    return [h * 360, s, i];
  };

  Color.hsi2rgb = function(h, s, i) {
    /*
    	borrowed from here:
    	http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/hsi2rgb.cpp
    */
    var PITHIRD, TWOPI, b, cos, g, r, _ref2;
    if (type(h) === "array" && h.length === 3) {
      _ref2 = h, h = _ref2[0], s = _ref2[1], i = _ref2[2];
    }
    TWOPI = Math.PI * 2;
    PITHIRD = Math.PI / 3;
    cos = Math.cos;
    if (h < 0) h += 360;
    if (h > 360) h -= 360;
    h /= 360;
    if (h < 1 / 3) {
      b = (1 - s) / 3;
      r = (1 + s * cos(TWOPI * h) / cos(PITHIRD - TWOPI * h)) / 3;
      g = 1 - (b + r);
    } else if (h < 2 / 3) {
      h -= 1 / 3;
      r = (1 - s) / 3;
      g = (1 + s * cos(TWOPI * h) / cos(PITHIRD - TWOPI * h)) / 3;
      b = 1 - (r + g);
    } else {
      h -= 2 / 3;
      g = (1 - s) / 3;
      b = (1 + s * cos(TWOPI * h) / cos(PITHIRD - TWOPI * h)) / 3;
      r = 1 - (g + b);
    }
    r = i * r * 3;
    g = i * g * 3;
    b = i * b * 3;
    return [r * 255, g * 255, b * 255];
  };

  chroma.Color = Color;

  chroma.hsl = function(h, s, l) {
    return new Color(h, s, l, 'hsl');
  };

  chroma.hsv = function(h, s, v) {
    return new Color(h, s, v, 'hsv');
  };

  chroma.rgb = function(r, g, b) {
    return new Color(r, g, b, 'rgb');
  };

  chroma.hex = function(x) {
    return new Color(x);
  };

  chroma.lab = function(l, a, b) {
    return new Color(l, a, b, 'lab');
  };

  chroma.hcl = function(c, s, l) {
    return new Color(c, s, l, 'hcl');
  };

  chroma.hsi = function(h, s, i) {
    return new Color(h, s, i, 'hsi');
  };

  chroma.interpolate = function(a, b, f, m) {
    if (!(a != null) || !(b != null)) return '#000';
    if (type(a) === 'string') a = new Color(a);
    if (type(b) === 'string') b = new Color(b);
    return a.interpolate(f, b, m);
  };

  ColorScale = (function() {

    /*
    	base class for color scales
    */

    function ColorScale(opts) {
      var c, col, cols, me, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
      me = this;
      me.colors = cols = (_ref2 = opts.colors) != null ? _ref2 : ['#ddd', '#222'];
      for (c = 0, _ref3 = cols.length - 1; 0 <= _ref3 ? c <= _ref3 : c >= _ref3; 0 <= _ref3 ? c++ : c--) {
        col = cols[c];
        if (type(col) === "string") cols[c] = new Color(col);
      }
      if (opts.positions != null) {
        me.pos = opts.positions;
      } else {
        me.pos = [];
        for (c = 0, _ref4 = cols.length - 1; 0 <= _ref4 ? c <= _ref4 : c >= _ref4; 0 <= _ref4 ? c++ : c--) {
          me.pos.push(c / (cols.length - 1));
        }
      }
      me.mode = (_ref5 = opts.mode) != null ? _ref5 : 'hsv';
      me.nacol = (_ref6 = opts.nacol) != null ? _ref6 : '#ccc';
      me.setClasses((_ref7 = opts.limits) != null ? _ref7 : [0, 1]);
      me;
    }

    ColorScale.prototype.getColor = function(value) {
      var c, f, f0, me;
      me = this;
      if (isNaN(value)) return me.nacol;
      if (me.classLimits.length > 2) {
        c = me.getClass(value);
        f = c / (me.numClasses - 1);
      } else {
        f = f0 = (value - me.min) / (me.max - me.min);
        f = Math.min(1, Math.max(0, f));
      }
      return me.fColor(f);
    };

    ColorScale.prototype.fColor = function(f) {
      var col, cols, i, me, p, _ref2;
      me = this;
      cols = me.colors;
      for (i = 0, _ref2 = me.pos.length - 1; 0 <= _ref2 ? i <= _ref2 : i >= _ref2; 0 <= _ref2 ? i++ : i--) {
        p = me.pos[i];
        if (f <= p) {
          col = cols[i];
          break;
        }
        if (f >= p && i === me.pos.length - 1) {
          col = cols[i];
          break;
        }
        if (f > p && f < me.pos[i + 1]) {
          f = (f - p) / (me.pos[i + 1] - p);
          col = chroma.interpolate(cols[i], cols[i + 1], f, me.mode);
          break;
        }
      }
      return col;
    };

    ColorScale.prototype.classifyValue = function(value) {
      var i, limits, maxc, minc, n, self;
      self = this;
      limits = self.classLimits;
      if (limits.length > 2) {
        n = limits.length - 1;
        i = self.getClass(value);
        value = limits[i] + (limits[i + 1] - limits[i]) * 0.5;
        minc = limits[0];
        maxc = limits[n - 1];
        value = self.min + ((value - minc) / (maxc - minc)) * (self.max - self.min);
      }
      return value;
    };

    ColorScale.prototype.setClasses = function(limits) {
      var me;
      if (limits == null) limits = [];
      /*
      		# use this if you want to display a limited number of data classes
      		# possible methods are "equalinterval", "quantiles", "custom"
      */
      me = this;
      me.classLimits = me.limits = limits;
      me.min = limits[0];
      me.max = limits[limits.length - 1];
      if (limits.length === 2) {
        return me.numClasses = 0;
      } else {
        return me.numClasses = limits.length - 1;
      }
    };

    ColorScale.prototype.getClass = function(value) {
      var i, limits, n, self;
      self = this;
      limits = self.classLimits;
      if (limits != null) {
        n = limits.length - 1;
        i = 0;
        while (i < n && value >= limits[i]) {
          i++;
        }
        return i - 1;
      }
    };

    ColorScale.prototype.validValue = function(value) {
      return !isNaN(value);
    };

    return ColorScale;

  })();

  chroma.ColorScale = ColorScale;

  Ramp = (function() {

    __extends(Ramp, ColorScale);

    function Ramp(col0, col1, mode) {
      if (col0 == null) col0 = '#fe0000';
      if (col1 == null) col1 = '#feeeee';
      if (mode == null) mode = 'hsl';
      Ramp.__super__.constructor.call(this, [col0, col1], [0, 1], mode);
    }

    return Ramp;

  })();

  chroma.Ramp = Ramp;

  Diverging = (function() {

    __extends(Diverging, ColorScale);

    function Diverging(col0, col1, col2, center, mode) {
      var me;
      if (col0 == null) col0 = '#d73027';
      if (col1 == null) col1 = '#ffffbf';
      if (col2 == null) col2 = '#1E6189';
      if (center == null) center = 'mean';
      if (mode == null) mode = 'hsl';
      me = this;
      me.mode = mode;
      me.center = center;
      Diverging.__super__.constructor.call(this, [col0, col1, col2], [0, .5, 1], mode);
    }

    Diverging.prototype.parseData = function(data, data_col) {
      var c, me;
      Diverging.__super__.parseData.call(this, data, data_col);
      me = this;
      c = me.center;
      if (c === 'median') {
        c = me.median;
      } else if (c === 'mean') {
        c = me.mean;
      }
      return me.pos[1] = (c - me.min) / (me.max - me.min);
    };

    return Diverging;

  })();

  chroma.Diverging = Diverging;

  Categories = (function() {

    __extends(Categories, ColorScale);

    function Categories(colors) {
      var me;
      me = this;
      me.colors = colors;
    }

    Categories.prototype.parseData = function(data, data_col) {};

    Categories.prototype.getColor = function(value) {
      var me;
      me = this;
      if (me.colors.hasOwnProperty(value)) {
        return me.colors[value];
      } else {
        return '#cccccc';
      }
    };

    Categories.prototype.validValue = function(value) {
      return this.colors.hasOwnProperty(value);
    };

    return Categories;

  })();

  chroma.Categories = Categories;

  CSSColors = (function() {

    __extends(CSSColors, ColorScale);

    function CSSColors(name) {
      var me;
      me = this;
      me.name = name;
      me.setClasses(7);
      me;
    }

    CSSColors.prototype.getColor = function(value) {
      var c, me;
      me = this;
      c = me.getClass(value);
      return me.name + ' l' + me.numClasses + ' c' + c;
    };

    return CSSColors;

  })();

  chroma.CSSColors = CSSColors;

  if ((_ref2 = chroma.scales) == null) chroma.scales = {};

  chroma.scales.cool = function() {
    return new Ramp(chroma.hsl(180, 1, .9), chroma.hsl(250, .7, .4));
  };

  chroma.scales.hot = function() {
    return new ColorScale({
      colors: ['#000000', '#ff0000', '#ffff00', '#ffffff'],
      positions: [0, .25, .75, 1],
      mode: 'rgb'
    });
  };

  chroma.scales.BlWhOr = function() {
    return new Diverging(chroma.hsl(30, 1, .55), '#ffffff', new Color(220, 1, .55));
  };

  chroma.scales.GrWhPu = function() {
    return new Diverging(chroma.hsl(120, .8, .4), '#ffffff', new Color(280, .8, .4));
  };

  chroma.limits = function(data, mode, num, prop) {
    var assignments, best, centroids, cluster, clusterSizes, dist, i, j, k, kClusters, limits, max, min, mindist, n, nb_iters, newCentroids, p, pb, pr, repeat, row, sum, tmpKMeansBreaks, val, value, values, _i, _j, _k, _len, _len2, _len3, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
    if (mode == null) mode = 'equal';
    if (num == null) num = 7;
    if (prop == null) prop = null;
    min = Number.MAX_VALUE;
    max = Number.MAX_VALUE * -1;
    sum = 0;
    values = [];
    if (type(data) === "array") {
      if (type(data[0]) !== "object" && type(data[0]) !== "array") {
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          val = data[_i];
          if (!isNaN(val)) values.push(Number(val));
        }
      } else {
        for (_j = 0, _len2 = data.length; _j < _len2; _j++) {
          row = data[_j];
          values.push(Number(row[prop]));
        }
      }
    } else if (type(data) === "object") {
      for (k in data) {
        val = data[k];
        if (type(val) === "object" && type(prop) === "string") {
          if (!isNaN(val[prop])) values.push(Number(val[prop]));
        } else if (type(val) === "array" && type(prop) === "number") {
          if (!isNaN(val[prop])) values.push(Number(val[prop]));
        } else if (type(val) === "number") {
          if (!isNaN(val)) values.push(Number(val));
        }
      }
    }
    for (_k = 0, _len3 = values.length; _k < _len3; _k++) {
      val = values[_k];
      if (!!isNaN(val)) continue;
      if (val < min) min = val;
      if (val > max) max = val;
      sum += val;
    }
    values = values.sort(function(a, b) {
      return a - b;
    });
    limits = [];
    if (mode.substr(0, 1) === 'c') {
      limits.push(min);
      limits.push(max);
    }
    if (mode.substr(0, 1) === 'e') {
      limits.push(min);
      for (i = 1, _ref3 = num - 1; 1 <= _ref3 ? i <= _ref3 : i >= _ref3; 1 <= _ref3 ? i++ : i--) {
        limits.push(min + (i / num) * (max - min));
      }
      limits.push(max);
    } else if (mode.substr(0, 1) === 'q') {
      limits.push(min);
      for (i = 1, _ref4 = num - 1; 1 <= _ref4 ? i <= _ref4 : i >= _ref4; 1 <= _ref4 ? i++ : i--) {
        p = values.length * i / num;
        pb = Math.floor(p);
        if (pb === p) {
          limits.push(values[pb]);
        } else {
          pr = p - pb;
          limits.push(values[pb] * pr + values[pb + 1] * (1 - pr));
        }
      }
      limits.push(max);
    } else if (mode.substr(0, 1) === 'k') {
      /*
      		implementation based on
      		http://code.google.com/p/figue/source/browse/trunk/figue.js#336
      		simplified for 1-d input values
      */
      n = values.length;
      assignments = new Array(n);
      clusterSizes = new Array(num);
      repeat = true;
      nb_iters = 0;
      centroids = null;
      centroids = [];
      centroids.push(min);
      for (i = 1, _ref5 = num - 1; 1 <= _ref5 ? i <= _ref5 : i >= _ref5; 1 <= _ref5 ? i++ : i--) {
        centroids.push(min + (i / num) * (max - min));
      }
      centroids.push(max);
      while (repeat) {
        for (j = 0, _ref6 = num - 1; 0 <= _ref6 ? j <= _ref6 : j >= _ref6; 0 <= _ref6 ? j++ : j--) {
          clusterSizes[j] = 0;
        }
        for (i = 0, _ref7 = n - 1; 0 <= _ref7 ? i <= _ref7 : i >= _ref7; 0 <= _ref7 ? i++ : i--) {
          value = values[i];
          mindist = Number.MAX_VALUE;
          for (j = 0, _ref8 = num - 1; 0 <= _ref8 ? j <= _ref8 : j >= _ref8; 0 <= _ref8 ? j++ : j--) {
            dist = Math.abs(centroids[j] - value);
            if (dist < mindist) {
              mindist = dist;
              best = j;
            }
          }
          clusterSizes[best]++;
          assignments[i] = best;
        }
        newCentroids = new Array(num);
        for (j = 0, _ref9 = num - 1; 0 <= _ref9 ? j <= _ref9 : j >= _ref9; 0 <= _ref9 ? j++ : j--) {
          newCentroids[j] = null;
        }
        for (i = 0, _ref10 = n - 1; 0 <= _ref10 ? i <= _ref10 : i >= _ref10; 0 <= _ref10 ? i++ : i--) {
          cluster = assignments[i];
          if (newCentroids[cluster] === null) {
            newCentroids[cluster] = values[i];
          } else {
            newCentroids[cluster] += values[i];
          }
        }
        for (j = 0, _ref11 = num - 1; 0 <= _ref11 ? j <= _ref11 : j >= _ref11; 0 <= _ref11 ? j++ : j--) {
          newCentroids[j] *= 1 / clusterSizes[j];
        }
        repeat = false;
        for (j = 0, _ref12 = num - 1; 0 <= _ref12 ? j <= _ref12 : j >= _ref12; 0 <= _ref12 ? j++ : j--) {
          if (newCentroids[j] !== centroids[i]) {
            repeat = true;
            break;
          }
        }
        centroids = newCentroids;
        nb_iters++;
        if (nb_iters > 200) repeat = false;
      }
      kClusters = {};
      for (j = 0, _ref13 = num - 1; 0 <= _ref13 ? j <= _ref13 : j >= _ref13; 0 <= _ref13 ? j++ : j--) {
        kClusters[j] = [];
      }
      for (i = 0, _ref14 = n - 1; 0 <= _ref14 ? i <= _ref14 : i >= _ref14; 0 <= _ref14 ? i++ : i--) {
        cluster = assignments[i];
        kClusters[cluster].push(values[i]);
      }
      tmpKMeansBreaks = [];
      for (j = 0, _ref15 = num - 1; 0 <= _ref15 ? j <= _ref15 : j >= _ref15; 0 <= _ref15 ? j++ : j--) {
        tmpKMeansBreaks.push(kClusters[j][0]);
        tmpKMeansBreaks.push(kClusters[j][kClusters[j].length - 1]);
      }
      tmpKMeansBreaks = tmpKMeansBreaks.sort(function(a, b) {
        return a - b;
      });
      limits.push(tmpKMeansBreaks[0]);
      for (i = 1, _ref16 = tmpKMeansBreaks.length - 1; i <= _ref16; i += 2) {
        if (!isNaN(tmpKMeansBreaks[i])) limits.push(tmpKMeansBreaks[i]);
      }
    }
    return limits;
  };

  /*
  utils.coffee
  */

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  type = (function() {
    /*
    	for browser-safe type checking+
    	ported from jQuery's $.type
    */
    var classToType, name, _i, _len, _ref3;
    classToType = {};
    _ref3 = "Boolean Number String Function Array Date RegExp Undefined Null".split(" ");
    for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
      name = _ref3[_i];
      classToType["[object " + name + "]"] = name.toLowerCase();
    }
    return function(obj) {
      var strType;
      strType = Object.prototype.toString.call(obj);
      return classToType[strType] || "object";
    };
  })();

  if ((_ref3 = root.type) == null) root.type = type;

  Array.max = function(array) {
    return Math.max.apply(Math, array);
  };

  Array.min = function(array) {
    return Math.min.apply(Math, array);
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

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  chroma = (_ref4 = root.chroma) != null ? _ref4 : root.chroma = {};

  chroma.brewer = brewer = {};

  brewer.OrRd = ['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000'];

  brewer.PuBu = ['#fff7fb', '#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#045a8d', '#023858'];

  brewer.BuPu = ['#f7fcfd', '#e0ecf4', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#810f7c', '#4d004b'];

  brewer.Oranges = ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704'];

  brewer.BuGn = ['#f7fcfd', '#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b'];

  brewer.YlOrBr = ['#ffffe5', '#fff7bc', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#993404', '#662506'];

  brewer.YlGn = ['#ffffe5', '#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#006837', '#004529'];

  brewer.Reds = ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'];

  brewer.RdPu = ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a'];

  brewer.Greens = ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'];

  brewer.YlGnBu = ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58'];

  brewer.Purples = ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d'];

  brewer.GnBu = ['#f7fcf0', '#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#0868ac', '#084081'];

  brewer.Greys = ['#ffffff', '#f0f0f0', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525', '#000000'];

  brewer.YlOrRd = ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'];

  brewer.PuRd = ['#f7f4f9', '#e7e1ef', '#d4b9da', '#c994c7', '#df65b0', '#e7298a', '#ce1256', '#980043', '#67001f'];

  brewer.Blues = ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'];

  brewer.PuBuGn = ['#fff7fb', '#ece2f0', '#d0d1e6', '#a6bddb', '#67a9cf', '#3690c0', '#02818a', '#016c59', '#014636'];

  brewer.Spectral = ['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2'];

  brewer.RdYlGn = ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#006837'];

  brewer.RdBu = ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061'];

  brewer.PiYG = ['#8e0152', '#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#f7f7f7', '#e6f5d0', '#b8e186', '#7fbc41', '#4d9221', '#276419'];

  brewer.PRGn = ['#40004b', '#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#a6dba0', '#5aae61', '#1b7837', '#00441b'];

  brewer.RdYlBu = ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'];

  brewer.BrBG = ['#543005', '#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#f5f5f5', '#c7eae5', '#80cdc1', '#35978f', '#01665e', '#003c30'];

  brewer.RdGy = ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#ffffff', '#e0e0e0', '#bababa', '#878787', '#4d4d4d', '#1a1a1a'];

  brewer.PuOr = ['#7f3b08', '#b35806', '#e08214', '#fdb863', '#fee0b6', '#f7f7f7', '#d8daeb', '#b2abd2', '#8073ac', '#542788', '#2d004b'];

  brewer.Set2 = ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3'];

  brewer.Accent = ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17', '#666666'];

  brewer.Set1 = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'];

  brewer.Set3 = ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f'];

  brewer.Dark2 = ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666'];

  brewer.Paired = ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'];

  brewer.Pastel2 = ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae', '#f1e2cc', '#cccccc'];

  brewer.Pastel1 = ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd', '#fddaec', '#f2f2f2'];

  /**
  	X11 color names
  	
  	http://www.w3.org/TR/css3-color/#svg-color
  */

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  chroma = (_ref5 = root.chroma) != null ? _ref5 : root.chroma = {};

  chroma.colors = colors = {};

  colors.indigo = "#4b0082";

  colors.gold = "#ffd700";

  colors.hotpink = "#ff69b4";

  colors.firebrick = "#b22222";

  colors.indianred = "#cd5c5c";

  colors.yellow = "#ffff00";

  colors.mistyrose = "#ffe4e1";

  colors.darkolivegreen = "#556b2f";

  colors.olive = "#808000";

  colors.darkseagreen = "#8fbc8f";

  colors.pink = "#ffc0cb";

  colors.tomato = "#ff6347";

  colors.lightcoral = "#f08080";

  colors.orangered = "#ff4500";

  colors.navajowhite = "#ffdead";

  colors.lime = "#00ff00";

  colors.palegreen = "#98fb98";

  colors.darkslategrey = "#2f4f4f";

  colors.greenyellow = "#adff2f";

  colors.burlywood = "#deb887";

  colors.seashell = "#fff5ee";

  colors.mediumspringgreen = "#00fa9a";

  colors.fuchsia = "#ff00ff";

  colors.papayawhip = "#ffefd5";

  colors.blanchedalmond = "#ffebcd";

  colors.chartreuse = "#7fff00";

  colors.dimgray = "#696969";

  colors.black = "#000000";

  colors.peachpuff = "#ffdab9";

  colors.springgreen = "#00ff7f";

  colors.aquamarine = "#7fffd4";

  colors.white = "#ffffff";

  colors.orange = "#ffa500";

  colors.lightsalmon = "#ffa07a";

  colors.darkslategray = "#2f4f4f";

  colors.brown = "#a52a2a";

  colors.ivory = "#fffff0";

  colors.dodgerblue = "#1e90ff";

  colors.peru = "#cd853f";

  colors.lawngreen = "#7cfc00";

  colors.chocolate = "#d2691e";

  colors.crimson = "#dc143c";

  colors.forestgreen = "#228b22";

  colors.darkgrey = "#a9a9a9";

  colors.lightseagreen = "#20b2aa";

  colors.cyan = "#00ffff";

  colors.mintcream = "#f5fffa";

  colors.silver = "#c0c0c0";

  colors.antiquewhite = "#faebd7";

  colors.mediumorchid = "#ba55d3";

  colors.skyblue = "#87ceeb";

  colors.gray = "#808080";

  colors.darkturquoise = "#00ced1";

  colors.goldenrod = "#daa520";

  colors.darkgreen = "#006400";

  colors.floralwhite = "#fffaf0";

  colors.darkviolet = "#9400d3";

  colors.darkgray = "#a9a9a9";

  colors.moccasin = "#ffe4b5";

  colors.saddlebrown = "#8b4513";

  colors.grey = "#808080";

  colors.darkslateblue = "#483d8b";

  colors.lightskyblue = "#87cefa";

  colors.lightpink = "#ffb6c1";

  colors.mediumvioletred = "#c71585";

  colors.slategrey = "#708090";

  colors.red = "#ff0000";

  colors.deeppink = "#ff1493";

  colors.limegreen = "#32cd32";

  colors.darkmagenta = "#8b008b";

  colors.palegoldenrod = "#eee8aa";

  colors.plum = "#dda0dd";

  colors.turquoise = "#40e0d0";

  colors.lightgrey = "#d3d3d3";

  colors.lightgoldenrodyellow = "#fafad2";

  colors.darkgoldenrod = "#b8860b";

  colors.lavender = "#e6e6fa";

  colors.maroon = "#800000";

  colors.yellowgreen = "#9acd32";

  colors.sandybrown = "#f4a460";

  colors.thistle = "#d8bfd8";

  colors.violet = "#ee82ee";

  colors.navy = "#000080";

  colors.magenta = "#ff00ff";

  colors.dimgrey = "#696969";

  colors.tan = "#d2b48c";

  colors.rosybrown = "#bc8f8f";

  colors.olivedrab = "#6b8e23";

  colors.blue = "#0000ff";

  colors.lightblue = "#add8e6";

  colors.ghostwhite = "#f8f8ff";

  colors.honeydew = "#f0fff0";

  colors.cornflowerblue = "#6495ed";

  colors.slateblue = "#6a5acd";

  colors.linen = "#faf0e6";

  colors.darkblue = "#00008b";

  colors.powderblue = "#b0e0e6";

  colors.seagreen = "#2e8b57";

  colors.darkkhaki = "#bdb76b";

  colors.snow = "#fffafa";

  colors.sienna = "#a0522d";

  colors.mediumblue = "#0000cd";

  colors.royalblue = "#4169e1";

  colors.lightcyan = "#e0ffff";

  colors.green = "#008000";

  colors.mediumpurple = "#9370db";

  colors.midnightblue = "#191970";

  colors.cornsilk = "#fff8dc";

  colors.paleturquoise = "#afeeee";

  colors.bisque = "#ffe4c4";

  colors.slategray = "#708090";

  colors.darkcyan = "#008b8b";

  colors.khaki = "#f0e68c";

  colors.wheat = "#f5deb3";

  colors.teal = "#008080";

  colors.darkorchid = "#9932cc";

  colors.deepskyblue = "#00bfff";

  colors.salmon = "#fa8072";

  colors.darkred = "#8b0000";

  colors.steelblue = "#4682b4";

  colors.palevioletred = "#db7093";

  colors.lightslategray = "#778899";

  colors.aliceblue = "#f0f8ff";

  colors.lightslategrey = "#778899";

  colors.lightgreen = "#90ee90";

  colors.orchid = "#da70d6";

  colors.gainsboro = "#dcdcdc";

  colors.mediumseagreen = "#3cb371";

  colors.lightgray = "#d3d3d3";

  colors.mediumturquoise = "#48d1cc";

  colors.lemonchiffon = "#fffacd";

  colors.cadetblue = "#5f9ea0";

  colors.lightyellow = "#ffffe0";

  colors.lavenderblush = "#fff0f5";

  colors.coral = "#ff7f50";

  colors.purple = "#800080";

  colors.aqua = "#00ffff";

  colors.whitesmoke = "#f5f5f5";

  colors.mediumslateblue = "#7b68ee";

  colors.darkorange = "#ff8c00";

  colors.mediumaquamarine = "#66cdaa";

  colors.darksalmon = "#e9967a";

  colors.beige = "#f5f5dc";

  colors.blueviolet = "#8a2be2";

  colors.azure = "#f0ffff";

  colors.lightsteelblue = "#b0c4de";

  colors.oldlace = "#fdf5e6";

}).call(this);
