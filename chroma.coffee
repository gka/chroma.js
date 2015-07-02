###
    chroma.js

    Copyright (c) 2011-2013, Gregor Aisch
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice, this
      list of conditions and the following disclaimer.

    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.

    * The name Gregor Aisch may not be used to endorse or promote products
      derived from this software without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
    AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    DISCLAIMED. IN NO EVENT SHALL GREGOR AISCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
    INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
    BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
    DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
    OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
    NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
    EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

    @source: https://github.com/gka/chroma.js
###

type = do ->
    ###
    for browser-safe type checking+
    ported from jQuery's $.type
    ###
    classToType = {}
    for name in "Boolean Number String Function Array Date RegExp Undefined Null".split(" ")
        classToType["[object " + name + "]"] = name.toLowerCase()

    (obj) ->
        strType = Object::toString.call(obj)
        classToType[strType] or "object"


limit = (x, min=0, max=1) ->
    x = min if x < min
    x = max if x > max
    x

unpack = (args) ->
    if args.length >= 3
        [].slice.call args
    else
        args[0]

clip_rgb = (rgb) ->
    for i of rgb
        if i < 3
            rgb[i] = 0 if rgb[i] < 0
            rgb[i] = 255 if rgb[i] > 255
        else if i == 3
            rgb[i] = 0 if rgb[i] < 0
            rgb[i] = 1 if rgb[i] > 1
    rgb

{PI, round, cos, floor, pow, log, sin, sqrt, atan2, max} = Math
TWOPI = PI*2
PITHIRD = PI/3




chroma = () ->
    return arguments[0] if arguments[0] instanceof Color
    new Color arguments...

_interpolators = []

# CommonJS module is defined
module.exports = chroma if module? and module.exports?

if typeof define == 'function' and define.amd
    define [], () -> chroma
else
    root = (exports ? this)
    root.chroma = chroma


chroma.version = '@@version'

# exposing raw classes for testing purposes


###*
    chroma.js

    Copyright (c) 2011-2013, Gregor Aisch
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice, this
      list of conditions and the following disclaimer.

    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.

    * The name Gregor Aisch may not be used to endorse or promote products
      derived from this software without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
    AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    DISCLAIMED. IN NO EVENT SHALL GREGOR AISCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
    INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
    BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
    DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
    OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
    NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
    EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

    @source: https://github.com/gka/chroma.js
###

_input = {}
_guess_formats = []
_guess_formats_sorted = false

class Color

    constructor: () ->
        me = @

        args = []
        for arg in arguments
            args.push arg if arg?

        # last argument could be the mode
        mode = args[args.length-1]
        if _input[mode]?
            me._rgb = clip_rgb _input[mode] unpack args[...-1]
        else
            # sort input type guess by desc priotity
            if not _guess_formats_sorted
                _guess_formats = _guess_formats.sort (a,b) ->
                    b.p - a.p
                _guess_formats_sorted = true
            # guess format
            for chk in _guess_formats
                mode = chk.test args...
                break if mode
            if mode
                me._rgb = clip_rgb _input[mode] args...

        # by now we should have a color
        console.warn 'unknown format: '+args if not me._rgb?
        me._rgb = [0,0,0] if not me._rgb?

        # add alpha
        me._rgb.push 1 if me._rgb.length == 3

    alpha: (alpha) ->
        if arguments.length
            @_rgb[3] = alpha
            return @
        @_rgb[3]

    toString: ->
        @name()



###*
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

    @preserve
###


chroma.brewer = brewer =
	# sequential
	OrRd: ['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000']
	PuBu: ['#fff7fb', '#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#045a8d', '#023858']
	BuPu: ['#f7fcfd', '#e0ecf4', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#810f7c', '#4d004b']
	Oranges: ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704']
	BuGn: ['#f7fcfd', '#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b']
	YlOrBr: ['#ffffe5', '#fff7bc', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#993404', '#662506']
	YlGn: ['#ffffe5', '#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#006837', '#004529']
	Reds: ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d']
	RdPu: ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a']
	Greens: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b']
	YlGnBu: ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58']
	Purples: ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d']
	GnBu: ['#f7fcf0', '#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#0868ac', '#084081']
	Greys: ['#ffffff', '#f0f0f0', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525', '#000000']
	YlOrRd: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026']
	PuRd: ['#f7f4f9', '#e7e1ef', '#d4b9da', '#c994c7', '#df65b0', '#e7298a', '#ce1256', '#980043', '#67001f']
	Blues: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b']
	PuBuGn: ['#fff7fb', '#ece2f0', '#d0d1e6', '#a6bddb', '#67a9cf', '#3690c0', '#02818a', '#016c59', '#014636']

	# diverging

	Spectral: ['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2']
	RdYlGn: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#006837']
	RdBu: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061']
	PiYG: ['#8e0152', '#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#f7f7f7', '#e6f5d0', '#b8e186', '#7fbc41', '#4d9221', '#276419']
	PRGn: ['#40004b', '#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#a6dba0', '#5aae61', '#1b7837', '#00441b']
	RdYlBu: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695']
	BrBG: ['#543005', '#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#f5f5f5', '#c7eae5', '#80cdc1', '#35978f', '#01665e', '#003c30']
	RdGy: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#ffffff', '#e0e0e0', '#bababa', '#878787', '#4d4d4d', '#1a1a1a']
	PuOr: ['#7f3b08', '#b35806', '#e08214', '#fdb863', '#fee0b6', '#f7f7f7', '#d8daeb', '#b2abd2', '#8073ac', '#542788', '#2d004b']

	# qualitative

	Set2: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3']
	Accent: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17', '#666666']
	Set1: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999']
	Set3: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f']
	Dark2: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666']
	Paired: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928']
	Pastel2: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae', '#f1e2cc', '#cccccc']
	Pastel1: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd', '#fddaec', '#f2f2f2']


###*
	X11 color names

	http://www.w3.org/TR/css3-color/#svg-color
###

w3cx11 =
    indigo: "#4b0082"
    gold: "#ffd700"
    hotpink: "#ff69b4"
    firebrick: "#b22222"
    indianred: "#cd5c5c"
    yellow: "#ffff00"
    mistyrose: "#ffe4e1"
    darkolivegreen: "#556b2f"
    olive: "#808000"
    darkseagreen: "#8fbc8f"
    pink: "#ffc0cb"
    tomato: "#ff6347"
    lightcoral: "#f08080"
    orangered: "#ff4500"
    navajowhite: "#ffdead"
    lime: "#00ff00"
    palegreen: "#98fb98"
    darkslategrey: "#2f4f4f"
    greenyellow: "#adff2f"
    burlywood: "#deb887"
    seashell: "#fff5ee"
    mediumspringgreen: "#00fa9a"
    fuchsia: "#ff00ff"
    papayawhip: "#ffefd5"
    blanchedalmond: "#ffebcd"
    chartreuse: "#7fff00"
    dimgray: "#696969"
    black: "#000000"
    peachpuff: "#ffdab9"
    springgreen: "#00ff7f"
    aquamarine: "#7fffd4"
    white: "#ffffff"
    orange: "#ffa500"
    lightsalmon: "#ffa07a"
    darkslategray: "#2f4f4f"
    brown: "#a52a2a"
    ivory: "#fffff0"
    dodgerblue: "#1e90ff"
    peru: "#cd853f"
    lawngreen: "#7cfc00"
    chocolate: "#d2691e"
    crimson: "#dc143c"
    forestgreen: "#228b22"
    darkgrey: "#a9a9a9"
    lightseagreen: "#20b2aa"
    cyan: "#00ffff"
    mintcream: "#f5fffa"
    silver: "#c0c0c0"
    antiquewhite: "#faebd7"
    mediumorchid: "#ba55d3"
    skyblue: "#87ceeb"
    gray: "#808080"
    darkturquoise: "#00ced1"
    goldenrod: "#daa520"
    darkgreen: "#006400"
    floralwhite: "#fffaf0"
    darkviolet: "#9400d3"
    darkgray: "#a9a9a9"
    moccasin: "#ffe4b5"
    saddlebrown: "#8b4513"
    grey: "#808080"
    darkslateblue: "#483d8b"
    lightskyblue: "#87cefa"
    lightpink: "#ffb6c1"
    mediumvioletred: "#c71585"
    slategrey: "#708090"
    red: "#ff0000"
    deeppink: "#ff1493"
    limegreen: "#32cd32"
    darkmagenta: "#8b008b"
    palegoldenrod: "#eee8aa"
    plum: "#dda0dd"
    turquoise: "#40e0d0"
    lightgrey: "#d3d3d3"
    lightgoldenrodyellow: "#fafad2"
    darkgoldenrod: "#b8860b"
    lavender: "#e6e6fa"
    maroon: "#800000"
    yellowgreen: "#9acd32"
    sandybrown: "#f4a460"
    thistle: "#d8bfd8"
    violet: "#ee82ee"
    navy: "#000080"
    magenta: "#ff00ff"
    dimgrey: "#696969"
    tan: "#d2b48c"
    rosybrown: "#bc8f8f"
    olivedrab: "#6b8e23"
    blue: "#0000ff"
    lightblue: "#add8e6"
    ghostwhite: "#f8f8ff"
    honeydew: "#f0fff0"
    cornflowerblue: "#6495ed"
    slateblue: "#6a5acd"
    linen: "#faf0e6"
    darkblue: "#00008b"
    powderblue: "#b0e0e6"
    seagreen: "#2e8b57"
    darkkhaki: "#bdb76b"
    snow: "#fffafa"
    sienna: "#a0522d"
    mediumblue: "#0000cd"
    royalblue: "#4169e1"
    lightcyan: "#e0ffff"
    green: "#008000"
    mediumpurple: "#9370db"
    midnightblue: "#191970"
    cornsilk: "#fff8dc"
    paleturquoise: "#afeeee"
    bisque: "#ffe4c4"
    slategray: "#708090"
    darkcyan: "#008b8b"
    khaki: "#f0e68c"
    wheat: "#f5deb3"
    teal: "#008080"
    darkorchid: "#9932cc"
    deepskyblue: "#00bfff"
    salmon: "#fa8072"
    darkred: "#8b0000"
    steelblue: "#4682b4"
    palevioletred: "#db7093"
    lightslategray: "#778899"
    aliceblue: "#f0f8ff"
    lightslategrey: "#778899"
    lightgreen: "#90ee90"
    orchid: "#da70d6"
    gainsboro: "#dcdcdc"
    mediumseagreen: "#3cb371"
    lightgray: "#d3d3d3"
    mediumturquoise: "#48d1cc"
    lemonchiffon: "#fffacd"
    cadetblue: "#5f9ea0"
    lightyellow: "#ffffe0"
    lavenderblush: "#fff0f5"
    coral: "#ff7f50"
    purple: "#800080"
    aqua: "#00ffff"
    whitesmoke: "#f5f5f5"
    mediumslateblue: "#7b68ee"
    darkorange: "#ff8c00"
    mediumaquamarine: "#66cdaa"
    darksalmon: "#e9967a"
    beige: "#f5f5dc"
    blueviolet: "#8a2be2"
    azure: "#f0ffff"
    lightsteelblue: "#b0c4de"
    oldlace: "#fdf5e6"
    rebeccapurple: "#663399"

chroma.colors = colors = w3cx11


# requrie lab-constants

lab2rgb = () ->
    [l,a,b] = unpack arguments
    ###
    adapted to match d3 implementation
    ###
    if l != undefined and l.length == 3
        [l,a,b] = l
    if l != undefined and l.length == 3
        [l,a,b] = l
    y = (l + 16) / 116
    x = y + a / 500
    z = y - b / 200;
    x = lab_xyz(x) * LAB_CONSTANTS.X
    y = lab_xyz(y) * LAB_CONSTANTS.Y
    z = lab_xyz(z) * LAB_CONSTANTS.Z
    r = xyz_rgb( 3.2404542 * x - 1.5371385 * y - 0.4985314 * z)
    g = xyz_rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z)
    b = xyz_rgb( 0.0556434 * x - 0.2040259 * y + 1.0572252 * z)
    [limit(r,0,255), limit(g,0,255), limit(b,0,255), 1]

lab_xyz = (x) ->
    if x > 0.206893034 then x * x * x else (x - 4 / 29) / 7.787037

xyz_rgb = (r) ->
    round(255 * (if r <= 0.00304 then 12.92 * r else 1.055 * pow(r, 1 / 2.4) - 0.055))



LAB_CONSTANTS =
    # Corresponds roughly to RGB brighter/darker
    K: 18

    # D65 standard referent
    X: 0.950470
    Y: 1
    Z: 1.088830


rgb2lab = () ->
    [r,g,b] = unpack arguments
    [x,y,z] = rgb2xyz r,g,b
    [116 * y - 16, 500 * (x - y), 200 * (y - z)]

rgb_xyz = (r) ->
    if (r /= 255) <= 0.04045 then r / 12.92 else pow((r + 0.055) / 1.055, 2.4)

xyz_lab = (x) ->
    if x > 0.008856 then pow(x, 1 / 3) else 7.787037 * x + 4 / 29

rgb2xyz = () ->
    [r,g,b] = unpack arguments
    r = rgb_xyz r
    g = rgb_xyz g
    b = rgb_xyz b
    x = xyz_lab (0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / LAB_CONSTANTS.X
    y = xyz_lab (0.2126729 * r + 0.7151522 * g + 0.0721750 * b) / LAB_CONSTANTS.Y
    z = xyz_lab (0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / LAB_CONSTANTS.Z
    [x,y,z]

chroma.lab = () ->
    new Color arguments..., 'lab'

_input.lab = lab2rgb

Color::lab = () ->
    rgb2lab @_rgb




#
# interpolates between a set of colors uzing a bezier spline
#

bezier = (colors) ->
    colors = (chroma(c) for c in colors)
    if colors.length == 2
        # linear interpolation
        [lab0, lab1] = (c.lab() for c in colors)
        I = (t) ->
            lab = (lab0[i] + t * (lab1[i] - lab0[i]) for i in [0..2])
            chroma.lab lab...
    else if colors.length == 3
        # quadratic bezier interpolation
        [lab0, lab1, lab2] = (c.lab() for c in colors)
        I = (t) ->
            lab = ((1-t)*(1-t) * lab0[i] + 2 * (1-t) * t * lab1[i] + t * t * lab2[i] for i in [0..2])
            chroma.lab lab...
    else if colors.length == 4
        # cubic bezier interpolation
        [lab0, lab1, lab2, lab3] = (c.lab() for c in colors)
        I = (t) ->
            lab = ((1-t)*(1-t)*(1-t) * lab0[i] + 3 * (1-t) * (1-t) * t * lab1[i] + 3 * (1-t) * t * t * lab2[i] + t*t*t * lab3[i] for i in [0..2])
            chroma.lab lab...
    else if colors.length == 5
        I0 = bezier colors[0..2]
        I1 = bezier colors[2..4]
        I = (t) ->
            if t < 0.5
                I0 t*2
            else
                I1 (t-0.5)*2
    I

chroma.bezier = bezier

###
    chroma.js

    Copyright (c) 2011-2013, Gregor Aisch
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice, this
      list of conditions and the following disclaimer.

    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.

    * The name Gregor Aisch may not be used to endorse or promote products
      derived from this software without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
    AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    DISCLAIMED. IN NO EVENT SHALL GREGOR AISCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
    INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
    BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
    DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
    OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
    NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
    EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

    @source: https://github.com/gka/chroma.js
###

# cubehelix interpolation
# based on D.A. Green "A colour scheme for the display of astronomical intensity images"
# http://astron-soc.in/bulletin/11June/289392011.pdf

chroma.cubehelix = (start=300, rotations=-1.5, hue=1, gamma=1, lightness=[0,1]) ->
    dl = lightness[1] - lightness[0]
    if type(hue) == 'array'
        dh = hue[1] - hue[0]
        hue = hue[1] if dh == 0
    else
        dh = 0
    (fract) ->
        a = TWOPI * ((start+120)/360 + rotations * fract)
        l = pow(lightness[0] + dl * fract, gamma)
        h = if dh != 0 then hue[0] + fract * dh else hue
        amp = h * l * (1-l) / 2
        cos_a = cos a
        sin_a = sin a
        r = l + amp * (-0.14861 * cos_a + 1.78277* sin_a)
        g = l + amp * (-0.29227 * cos_a - 0.90649* sin_a)
        b = l + amp * (+1.97294 * cos_a)
        chroma clip_rgb [r*255,g*255,b*255]





chroma.random = ->
    digits = '0123456789abcdef'
    code = '#'
    code += digits.charAt(floor(Math.random() * 16)) for i in [0...6]
    new Color code

_input.rgb = () ->
    (v for k,v of unpack arguments)

chroma.rgb = () ->
    new Color arguments..., 'rgb'

Color::rgb = ->
    @_rgb.slice 0,3

Color::rgba = ->
    @_rgb

_guess_formats.push
    p: 15
    test: (n) ->
        a = unpack arguments
        return 'rgb' if type(a) == 'array' and a.length == 3
        return 'rgb' if a.length == 4 and type(a[3]) == "number" and a[3] >= 0 and a[3] <= 1


hex2rgb = (hex) ->
    if hex.match /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
        if hex.length == 4 or hex.length == 7
            hex = hex.substr(1)
        if hex.length == 3
            hex = hex.split("")
            hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]
        u = parseInt(hex, 16)
        r = u >> 16
        g = u >> 8 & 0xFF
        b = u & 0xFF
        return [r,g,b,1]

    # match rgba hex format, eg #FF000077
    if hex.match /^#?([A-Fa-f0-9]{8})$/
        if hex.length == 9
            hex = hex.substr(1)
        u = parseInt(hex, 16)
        r = u >> 24 & 0xFF
        g = u >> 16 & 0xFF
        b = u >> 8 & 0xFF
        a = round((u & 0xFF) / 0xFF * 100) / 100
        return [r,g,b,a]

    # check for css colors, too
    if _input.css? and rgb = _input.css hex
        return rgb

    throw "unknown color: "+hex



rgb2hex = (channels, mode='rgb') ->
    [r,g,b,a] = channels
    u = r << 16 | g << 8 | b
    str = "000000" + u.toString(16) #.toUpperCase()
    str = str.substr(str.length - 6)
    hxa = '0' + round(a * 255).toString(16)
    hxa = hxa.substr(hxa.length - 2)
    "#" + switch mode.toLowerCase()
          when 'rgba' then str + hxa
          when 'argb' then hxa + str
          else str


_input.hex = (h) ->
    hex2rgb h

chroma.hex = () ->
    new Color arguments..., 'hex'

Color::hex = (mode='rgb') ->
    rgb2hex @_rgb, mode

_guess_formats.push
    p: 10,
    test: (n) ->
        'hex' if arguments.length == 1 and type(n) == "string"

hsl2rgb = () ->
    [h,s,l] = unpack arguments
    if s == 0
        r = g = b = l*255
    else
        t3 = [0,0,0]
        c = [0,0,0]
        t2 = if l < 0.5 then l * (1+s) else l+s-l*s
        t1 = 2 * l - t2
        h /= 360
        t3[0] = h + 1/3
        t3[1] = h
        t3[2] = h - 1/3
        for i in [0..2]
            t3[i] += 1 if t3[i] < 0
            t3[i] -= 1 if t3[i] > 1
            if 6 * t3[i] < 1
                c[i] = t1 + (t2 - t1) * 6 * t3[i]
            else if 2 * t3[i] < 1
                c[i] = t2
            else if 3 * t3[i] < 2
                c[i] = t1 + (t2 - t1) * ((2 / 3) - t3[i]) * 6
            else
                c[i] = t1
        [r,g,b] = [round(c[0]*255),round(c[1]*255),round(c[2]*255)]
    if arguments.length == 4 then [r,g,b,arguments[3]] else [r,g,b]



rgb2hsl = (r,g,b) ->
    if r != undefined and r.length >= 3
        [r,g,b] = r
    r /= 255
    g /= 255
    b /= 255

    min = Math.min(r, g, b)
    max = Math.max(r, g, b)

    l = (max + min) / 2

    if max == min
        s = 0
        h = Number.NaN
    else
        s = if l < 0.5 then (max - min) / (max + min) else (max - min) / (2 - max - min)

    if r == max then h = (g - b) / (max - min)
    else if (g == max) then h = 2 + (b - r) / (max - min)
    else if (b == max) then h = 4 + (r - g) / (max - min)

    h *= 60;
    h += 360 if h < 0
    [h,s,l]


chroma.hsl = () ->
    new Color arguments..., 'hsl'

_input.hsl = hsl2rgb

Color::hsl = () ->
    rgb2hsl @_rgb





hsv2rgb = () ->
    [h,s,v] = unpack arguments
    v *= 255
    if s is 0
        r = g = b = v
    else
        h = 0 if h is 360
        h -= 360 if h > 360
        h += 360 if h < 0
        h /= 60
        i = floor h
        f = h - i
        p = v * (1 - s)
        q = v * (1 - s * f)
        t = v * (1 - s * (1 - f))
        switch i
            when 0 then [r,g,b] = [v, t, p]
            when 1 then [r,g,b] = [q, v, p]
            when 2 then [r,g,b] = [p, v, t]
            when 3 then [r,g,b] = [p, q, v]
            when 4 then [r,g,b] = [t, p, v]
            when 5 then [r,g,b] = [v, p, q]
    r = round r
    g = round g
    b = round b
    [r, g, b]


rgb2hsv = () ->
    [r,g,b] = unpack arguments
    min = Math.min(r, g, b)
    max = Math.max(r, g, b)
    delta = max - min
    v = max / 255.0
    if max == 0
        h = Number.NaN
        s = 0
    else
        s = delta / max
        if r is max then h = (g - b) / delta
        if g is max then h = 2+(b - r) / delta
        if b is max then h = 4+(r - g) / delta
        h *= 60;
        if h < 0 then h += 360
    [h, s, v]


chroma.hsv = () ->
    new Color arguments..., 'hsv'

_input.hsv = hsv2rgb

Color::hsv = () ->
    rgb2hsv @_rgb

num2rgb = (num) ->
    if type(num) == "number" && num >= 0 && num <= 0xFFFFFF
        r = num >> 16
        g = (num >> 8) & 0xFF
        b = num & 0xFF
        return [r,g,b,1]
    console.warn "unknown num color: "+num
    [0,0,0,1]


rgb2num = () ->
    [r,g,b] = unpack arguments
    (r << 16) + (g << 8) + b


chroma.num = (num) ->
    new Color num, 'num'

Color::num = () ->
    rgb2num @_rgb

_input.num = num2rgb

_guess_formats.push
    p: 10,
    test: (n) ->
        'num' if arguments.length == 1 and type(n) == "number" and n >= 0 and n <= 0xFFFFFF

css2rgb = (css) ->
    css = css.toLowerCase()
    # named X11 colors
    if chroma.colors? and chroma.colors[css]
        return hex2rgb chroma.colors[css]
    # rgb(250,20,0)
    if m = css.match /rgb\(\s*(\-?\d+),\s*(\-?\d+)\s*,\s*(\-?\d+)\s*\)/
        rgb = m.slice 1,4
        for i in [0..2]
            rgb[i] = +rgb[i]
        rgb[3] = 1  # default alpha
    # rgba(250,20,0,0.4)
    else if m = css.match /rgba\(\s*(\-?\d+),\s*(\-?\d+)\s*,\s*(\-?\d+)\s*,\s*([01]|[01]?\.\d+)\)/
        rgb = m.slice 1,5
        for i in [0..3]
            rgb[i] = +rgb[i]
    # rgb(100%,0%,0%)
    else if m = css.match /rgb\(\s*(\-?\d+(?:\.\d+)?)%,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*\)/
        rgb = m.slice 1,4
        for i in [0..2]
            rgb[i] = round rgb[i] * 2.55
        rgb[3] = 1  # default alpha
    # rgba(100%,0%,0%,0.4)
    else if m = css.match /rgba\(\s*(\-?\d+(?:\.\d+)?)%,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)/
        rgb = m.slice 1,5
        for i in [0..2]
            rgb[i] = round rgb[i] * 2.55
        rgb[3] = +rgb[3]
    # hsl(0,100%,50%)
    else if m = css.match /hsl\(\s*(\-?\d+(?:\.\d+)?),\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*\)/
        hsl = m.slice 1,4
        hsl[1] *= 0.01
        hsl[2] *= 0.01
        rgb = hsl2rgb hsl
        rgb[3] = 1
    # hsla(0,100%,50%,0.5)
    else if m = css.match /hsla\(\s*(\-?\d+(?:\.\d+)?),\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)/
        hsl = m.slice 1,4
        hsl[1] *= 0.01
        hsl[2] *= 0.01
        rgb = hsl2rgb hsl
        rgb[3] = +m[4]  # default alpha = 1
    rgb


rgb2css = (rgba) ->
    mode = if rgba[3] < 1 then 'rgba' else 'rgb'
    if mode == 'rgb'
        mode+'('+rgba.slice(0,3).map(round).join(',')+')'
    else if mode == 'rgba'
        mode+'('+rgba.slice(0,3).map(round).join(',')+','+rgba[3]+')'
    else



rnd = (a) -> round(a*100)/100

hsl2css = (hsl, alpha) ->
    mode = if alpha < 1 then 'hsla' else 'hsl'
    hsl[0] = rnd(hsl[0] || 0)
    hsl[1] = rnd(hsl[1]*100) + '%'
    hsl[2] = rnd(hsl[2]*100) + '%'
    hsl[3] = alpha if mode == 'hsla'
    mode + '(' + hsl.join(',') + ')'

_input.css = (h) ->
    css2rgb h

chroma.css = () ->
    new Color arguments..., 'css'

Color::css = (mode='rgb') ->
    if mode[0..2] == 'rgb'
        rgb2css @_rgb
    else if mode[0..2] == 'hsl'
        hsl2css @hsl(), @alpha()


#
#

_input.named = (name) ->
    hex2rgb w3cx11[name]

_guess_formats.push
    p: 20,
    test: (n) ->
        'named' if arguments.length == 1 and w3cx11[n]?

Color::name = (n) ->
    if arguments.length
        @_rgb = hex2rgb w3cx11[n] if w3cx11[n]
        @_rgb[3] = 1
        @
    # resolve name from hex
    h = @hex()
    for k of w3cx11
        if h == w3cx11[k]
            return k
    h


lch2lab = () ->
    ###
    Convert from a qualitative parameter h and a quantitative parameter l to a 24-bit pixel.
    These formulas were invented by David Dalrymple to obtain maximum contrast without going
    out of gamut if the parameters are in the range 0-1.

    A saturation multiplier was added by Gregor Aisch
    ###
    [l,c,h] = unpack arguments
    h = h * PI / 180
    [l, cos(h) * c, sin(h) * c]



lch2rgb = () ->
    [l,c,h] = unpack arguments
    [L,a,b] = lch2lab l,c,h
    [r,g,b] = lab2rgb L,a,b
    [limit(r,0,255), limit(g,0,255), limit(b,0,255)]


lab2lch = () ->
    [l, a, b] = unpack arguments
    c = sqrt(a * a + b * b)
    h = (atan2(b, a) / PI * 180 + 360) % 360
    [l, c, h]



rgb2lch = () ->
    [r,g,b] = unpack arguments
    [l,a,b] = rgb2lab r,g,b
    lab2lch l,a,b


chroma.lch = () ->
    args = unpack arguments
    new Color args, 'lch'

chroma.hcl = () ->
    args = unpack arguments
    new Color args, 'hcl'

_input.lch = lch2rgb

_input.hcl = () ->
    [h,c,l] = unpack arguments
    lch2rgb [l,c,h]

Color::lch = () ->
    rgb2lch @_rgb

Color::hcl = () ->
    rgb2lch(@_rgb).reverse()





rgb2cmyk = (mode='rgb') ->
    [r,g,b] = unpack arguments
    r = r / 255
    g = g / 255
    b = b / 255
    k = 1 - Math.max(r,Math.max(g,b))
    f = if k < 1 then 1 / (1-k) else 0
    c = (1-r-k) * f
    m = (1-g-k) * f
    y = (1-b-k) * f
    [c,m,y,k]



cmyk2rgb = () ->
    [c,m,y,k] = unpack arguments
    return [0,0,0] if k == 1
    r = if c >= 1 then 0 else round 255 * (1-c) * (1-k)
    g = if m >= 1 then 0 else round 255 * (1-m) * (1-k)
    b = if y >= 1 then 0 else round 255 * (1-y) * (1-k)
    [r,g,b]

_input.cmyk = () ->
    [c,m,y,k] = unpack arguments
    cmyk2rgb c,m,y,k


chroma.cmyk = () ->
    new Color arguments..., 'cmyk'

Color::cmyk = () ->
    rgb2cmyk @_rgb

_input.gl = () ->
    rgb = (v for k,v of unpack arguments)
    for i in [0..2]
        rgb[i] *= 255
    rgb

chroma.gl = () ->
    new Color arguments..., 'gl'

Color::gl = () ->
    rgb = @_rgb
    [rgb[0]/255, rgb[1]/255, rgb[2]/255, rgb[3]]


rgb2luminance = (r,g,b) ->
    # relative luminance
    # see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
    [r,g,b] = unpack arguments
    r = luminance_x r
    g = luminance_x g
    b = luminance_x b
    0.2126 * r + 0.7152 * g + 0.0722 * b


luminance_x = (x) ->
    x /= 255
    if x <= 0.03928 then x/12.92 else pow((x+0.055)/1.055, 2.4)





_interpolators = []

interpolate = (col1, col2, f=0.5, m='rgb') ->
    ###
    interpolates between colors
    f = 0 --> me
    f = 1 --> col
    ###
    col1 = chroma col1 if type(col1) != 'object'
    col2 = chroma col2 if type(col2) != 'object'

    for interpol in _interpolators
        if m == interpol[0]
            res = interpol[1] col1, col2, f, m
            break

    throw "color mode "+m+" is not supported" if not res?

    # interpolate alpha at last
    res.alpha col1.alpha() + f * (col2.alpha() - col1.alpha())
    res

chroma.interpolate = interpolate

Color::interpolate = (col2, f, m) ->
    interpolate @, col2, f, m

chroma.mix = interpolate
Color::mix = Color::interpolate

interpolate_rgb = (col1, col2, f, m) ->
    xyz0 = col1._rgb
    xyz1 = col2._rgb
    new Color(
        xyz0[0] + f * (xyz1[0]-xyz0[0]),
        xyz0[1] + f * (xyz1[1]-xyz0[1]),
        xyz0[2] + f * (xyz1[2]-xyz0[2]),
        m
    )

_interpolators.push ['rgb', interpolate_rgb]


Color::luminance = (lum, mode='rgb') ->
    return rgb2luminance @_rgb if !arguments.length
    # set luminance
    if lum == 0 then @_rgb = [0,0,0,@_rgb[3]]
    else if lum == 1 then @_rgb = [255,255,255,@_rgb[3]]
    else
        eps = 1e-7
        max_iter = 20
        test = (l,h) ->
            m = l.interpolate(h, 0.5, mode)
            lm = m.luminance()
            if Math.abs(lum - lm) < eps or not max_iter--
                return m
            if lm > lum
                return test(l, m)
            return test(m, h)

        cur_lum = rgb2luminance @_rgb
        @_rgb = (if cur_lum > lum then test(chroma('black'), @) else test(@, chroma('white'))).rgba()

    @


#
# Based on implementation by Neil Bartlett
# https://github.com/neilbartlett/color-temperature
#

temperature2rgb = (kelvin) ->
    temp = kelvin / 100
    if temp < 66
        r = 255
        g = -155.25485562709179 - 0.44596950469579133 * (g = temp-2) + 104.49216199393888 * log(g)
        b = if temp < 20 then 0 else -254.76935184120902 + 0.8274096064007395 * (b = temp-10) + 115.67994401066147 * log(b)
    else
        r = 351.97690566805693 + 0.114206453784165 * (r = temp-55) - 40.25366309332127 * log(r)
        g = 325.4494125711974 + 0.07943456536662342 * (g = temp-50) - 28.0852963507957 * log(g)
        b = 255
    clip_rgb [r,g,b]


#
# Based on implementation by Neil Bartlett
# https://github.com/neilbartlett/color-temperature
#

rgb2temperature = () ->
    [r,g,b] = unpack arguments
    minTemp = 1000
    maxTemp = 40000
    eps = 0.4
    while maxTemp - minTemp > eps
        temp = (maxTemp + minTemp) * 0.5
        rgb = temperature2rgb temp
        if (rgb[2] / rgb[0]) >= (b / r)
            maxTemp = temp
        else
            minTemp = temp
    round temp



chroma.temperature = chroma.kelvin = () ->
    new Color arguments..., 'temperature'

_input.temperature = _input.kelvin = _input.K = temperature2rgb

Color::temperature = () ->
    rgb2temperature @_rgb

Color::kelvin = Color::temperature



chroma.contrast = (a, b) ->
    # WCAG contrast ratio
    # see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
    a = new Color a if type(a) in ['string', 'number']
    b = new Color b if type(b) in ['string', 'number']
    l1 = a.luminance()
    l2 = b.luminance()
    if l1 > l2 then (l1 + 0.05) / (l2 + 0.05) else (l2 + 0.05) / (l1 + 0.05)


Color::darken = (amount=20) ->
    me = @
    lch = me.lch()
    lch[0] -= amount
    chroma.lch(lch).alpha(me.alpha())

Color::darker = Color::darken

Color::brighten = (amount=20) ->
    @darken -amount

Color::brighter = Color::brighten


Color::saturate = (amount=20) ->
    me = @
    lch = me.lch()
    lch[1] += amount
    lch[1] = 0 if lch[1] < 0 
    chroma.lch(lch).alpha(me.alpha())

Color::desaturate = (amount=20) ->
	@saturate -amount

Color::premultiply = ->
    rgb = @rgb()
    a = @alpha()
    chroma(rgb[0]*a, rgb[1]*a, rgb[2]*a, a)


#
# interpolates between a set of colors uzing a bezier spline
# blend mode formulas taken from http://www.venture-ware.com/kevin/coding/lets-learn-math-photoshop-blend-modes/
#

blend = (bottom, top, mode) ->
    if !blend[mode]
        throw 'unknown blend mode ' + mode
    blend[mode](bottom, top)

blend_f = (f) ->
    (bottom,top) ->
        c0 = chroma(top).rgb()
        c1 = chroma(bottom).rgb()
        chroma(f(c0,c1), 'rgb')

each = (f) ->
    (c0, c1) ->
        out = []
        for i in [0..3]
            out[i] = f(c0[i], c1[i])
        out

normal = (a,b) ->
    a

multiply = (a,b) ->
    a * b / 255

darken = (a,b) ->
    if a > b then b else a

lighten = (a,b) ->
    if a > b then a else b

screen = (a,b) ->
    255 * (1 - (1-a/255) * (1-b/255))

overlay = (a,b) ->
    if b < 128
        2 * a * b / 255
    else
        255 * (1 - 2 * (1 - a / 255 ) * ( 1 - b / 255 ))

burn = (a,b) ->
    255 * (1 - (1 - b / 255) / (a/255))

dodge = (a,b) ->
    return 255 if a == 255
    a = 255 * (b / 255) / (1 - a / 255)
    if a > 255 then 255 else a

# add = (a,b) ->
#     if (a + b > 255) then 255 else a + b

blend.normal = blend_f each normal
blend.multiply = blend_f each multiply
blend.screen = blend_f each screen
blend.overlay = blend_f each overlay
blend.darken = blend_f each darken
blend.lighten = blend_f each lighten
blend.dodge = blend_f each dodge
blend.burn = blend_f each burn
# blend.add = blend_f each add

chroma.blend = blend

###
    chroma.js

    Copyright (c) 2011-2013, Gregor Aisch
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice, this
      list of conditions and the following disclaimer.

    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.

    * The name Gregor Aisch may not be used to endorse or promote products
      derived from this software without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
    AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    DISCLAIMED. IN NO EVENT SHALL GREGOR AISCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
    INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
    BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
    DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
    OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
    NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
    EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

    @source: https://github.com/gka/chroma.js
###

# minimal multi-purpose interface

chroma.scale = (colors, positions) ->

    # constructor
    _mode = 'rgb'
    _nacol = chroma '#ccc'
    _spread = 0
    _fixed = false
    _domain = [0, 1]
    _colors = []
    _out = false
    _pos = []
    _min = 0
    _max = 1
    _correctLightness = false
    _numClasses = 0
    _colorCache = {}

    # private methods

    setColors = (colors, positions) ->
        if not colors?
            colors = ['#ddd', '#222']
        if colors? and type(colors) == 'string' and chroma.brewer?[colors]?
            colors = chroma.brewer[colors]
        if type(colors) == 'array'
            # make a copy of the colors
            colors = colors.slice(0)
            # convert to chroma classes
            for c in [0..colors.length-1]
                col = colors[c]
                colors[c] = chroma(col) if type(col) == "string"
            # auto-fill color position
            if positions?
                _pos = positions
            else
                _pos = []
                for c in [0..colors.length-1]
                    _pos.push c/(colors.length-1)
        resetCache()
        _colors = colors

    setDomain = (domain = []) ->
        ###
        # use this if you want to display a limited number of data classes
        # possible methods are "equalinterval", "quantiles", "custom"
        ###
        _domain = domain
        _min = domain[0]
        _max = domain[domain.length-1]
        resetCache()
        if domain.length == 2
            _numClasses = 0
        else
            _numClasses = domain.length-1

    getClass = (value) ->
        if _domain?
            n = _domain.length-1
            i = 0
            while i < n and value >= _domain[i]
                i++
            return i-1
        return 0

    tmap = (t) -> t

    classifyValue = (value) ->
        val = value
        if _domain.length > 2
            n = _domain.length-1
            i = getClass(value)
            minc = _domain[0] + (_domain[1]-_domain[0]) * (0 + _spread * 0.5)  # center of 1st class
            maxc = _domain[n-1] + (_domain[n]-_domain[n-1]) * (1 - _spread * 0.5)  # center of last class
            val = _min + ((_domain[i] + (_domain[i+1] - _domain[i]) * 0.5 - minc) / (maxc-minc)) * (_max - _min)
        val

    getColor = (val, bypassMap=false) ->
        if isNaN(val) then return _nacol
        if not bypassMap
            if _domain.length > 2
                c = getClass val
                t = c / (_numClasses-1)
            else
                t = f0 = if _min != _max then (val - _min) / (_max - _min) else 0
                t = f0 = (val - _min) / (_max - _min)
                t = Math.min(1, Math.max(0, t))
        else
            t = val

        if not bypassMap
            t = tmap t  # lightness correction

        k = Math.floor(t * 10000)

        if _colorCache[k]
            col = _colorCache[k]
        else
            if type(_colors) == 'array'
                for i in [0.._pos.length-1]
                    p = _pos[i]
                    if t <= p
                        col = _colors[i]
                        break
                    if t >= p and i == _pos.length-1
                        col = _colors[i]
                        break
                    if t > p and t < _pos[i+1]
                        t = (t-p)/(_pos[i+1]-p)
                        col = chroma.interpolate _colors[i], _colors[i+1], t, _mode
                        break
            else if type(_colors) == 'function'
                col = _colors t
            _colorCache[k] = col
        col

    resetCache = () ->
        _colorCache = {}

    setColors colors, positions

    # public interface

    f = (v) ->
        c = getColor v
        if _out and c[_out] then c[_out]() else c

    f.domain = (domain, classes, mode='e', key) ->
        if not arguments.length
            return _domain
        if classes?
            d = chroma.analyze domain, key
            if classes == 0
                domain = [d.min, d.max]
            else
                domain = chroma.limits d, mode, classes
        setDomain domain
        f

    f.mode = (_m) ->
        if not arguments.length
            return _mode
        _mode = _m
        resetCache()
        f

    f.range = (colors, _pos) ->
        setColors colors, _pos
        f

    f.out = (_o) ->
        _out = _o
        f

    f.spread = (val) ->
        if not arguments.length
            return _spread
        _spread = val
        f

    f.correctLightness = (v) ->
        if not arguments.length
            return _correctLightness
        _correctLightness = v
        resetCache()
        if _correctLightness
            tmap = (t) ->
                L0 = getColor(0, true).lab()[0]
                L1 = getColor(1, true).lab()[0]
                pol = L0 > L1
                L_actual = getColor(t, true).lab()[0]
                L_ideal = L0 + (L1 - L0) * t
                L_diff = L_actual - L_ideal
                t0 = 0
                t1 = 1
                max_iter = 20
                while Math.abs(L_diff) > 1e-2 and max_iter-- > 0
                    do () ->
                        L_diff *= -1 if pol
                        if L_diff < 0
                            t0 = t
                            t += (t1 - t) * 0.5
                        else
                            t1 = t
                            t += (t0 - t) * 0.5
                        L_actual = getColor(t, true).lab()[0]
                        L_diff = L_actual - L_ideal
                t
        else
            tmap = (t) -> t
        f

    f.colors = (out='hex') ->
        # returns all colors based on the defined classes
        colors = []
        samples = []
        if _domain.length > 2
            for i in [1..._domain.length]
                samples.push (_domain[i-1]+_domain[i])*0.5
        else
            samples = _domain
        for i in samples
            colors.push f(i)[out]()
        colors

    f

# some pre-defined color scales:
chroma.scales ?= {}

chroma.scales.cool = ->
    chroma.scale [chroma.hsl(180,1,.9), chroma.hsl(250,.7,.4)]

chroma.scales.hot = ->
    chroma.scale(['#000','#f00','#ff0','#fff'], [0,.25,.75,1]).mode('rgb')



###
    chroma.js

    Copyright (c) 2011-2013, Gregor Aisch
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice, this
      list of conditions and the following disclaimer.

    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.

    * The name Gregor Aisch may not be used to endorse or promote products
      derived from this software without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
    AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    DISCLAIMED. IN NO EVENT SHALL GREGOR AISCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
    INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
    BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
    DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
    OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
    NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
    EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

    @source: https://github.com/gka/chroma.js
###



chroma.analyze = (data, key, filter) ->
    r =
        min: Number.MAX_VALUE
        max: Number.MAX_VALUE*-1
        sum: 0
        values: []
        count: 0

    if not filter?
        filter = ->
            true

    add = (val) ->
        if val? and not isNaN val
            r.values.push val
            r.sum += val
            r.min = val if val < r.min
            r.max = val if val > r.max
            r.count += 1
        return

    visit = (val, k) ->
        if filter val, k
            if key? and type(key) == 'function'
                add key val
            else if key? and type(key) == 'string' or type(key) == 'number'
                add val[key]
            else
                add val

    if type(data) == 'array'
        for val in data
            visit val
    else
        for k, val of data
            visit val, k
    r.domain = [r.min, r.max]
    r.limits = (mode, num) ->
        chroma.limits r, mode, num
    r



chroma.limits = (data, mode='equal', num=7) ->
    if type(data) == 'array'
        data = chroma.analyze data
    min = data.min
    max = data.max
    sum = data.sum
    values = data.values.sort (a,b)->
        a-b

    limits = []

    if mode.substr(0,1) == 'c' # continuous
        limits.push min
        limits.push max

    if mode.substr(0,1) == 'e' # equal interval
        limits.push min
        for i in [1..num-1]
            limits.push min+(i/num)*(max-min)
        limits.push max

    else if mode.substr(0,1) == 'l' # log scale
        if min <= 0
            throw 'Logarithmic scales are only possible for values > 0'
        min_log = Math.LOG10E * log min
        max_log = Math.LOG10E * log max
        limits.push min
        for i in [1..num-1]
            limits.push pow 10, min_log + (i/num) * (max_log - min_log)
        limits.push max

    else if mode.substr(0,1) == 'q' # quantile scale
        limits.push min
        for i in [1..num-1]
            p = values.length * i/num
            pb = floor p
            if pb == p
                limits.push values[pb]
            else # p > pb
                pr = p - pb
                limits.push values[pb]*pr + values[pb+1]*(1-pr)
        limits.push max

    else if mode.substr(0,1) == 'k' # k-means clustering
        ###
        implementation based on
        http://code.google.com/p/figue/source/browse/trunk/figue.js#336
        simplified for 1-d input values
        ###
        n = values.length
        assignments = new Array n
        clusterSizes = new Array num
        repeat = true
        nb_iters = 0
        centroids = null

        # get seed values
        centroids = []
        centroids.push min
        for i in [1..num-1]
            centroids.push min + (i/num) * (max-min)
        centroids.push max

        while repeat
            # assignment step
            for j in [0..num-1]
                clusterSizes[j] = 0
            for i in [0..n-1]
                value = values[i]
                mindist = Number.MAX_VALUE
                for j in [0..num-1]
                    dist = abs centroids[j]-value
                    if dist < mindist
                        mindist = dist
                        best = j
                clusterSizes[best]++
                assignments[i] = best

            # update centroids step
            newCentroids = new Array num
            for j in [0..num-1]
                newCentroids[j] = null
            for i in [0..n-1]
                cluster = assignments[i]
                if newCentroids[cluster] == null
                    newCentroids[cluster] = values[i]
                else
                    newCentroids[cluster] += values[i]
            for j in [0..num-1]
                newCentroids[j] *= 1/clusterSizes[j]

            # check convergence
            repeat = false
            for j in [0..num-1]
                if newCentroids[j] != centroids[i]
                    repeat = true
                    break

            centroids = newCentroids
            nb_iters++

            if nb_iters > 200
                repeat = false

        # finished k-means clustering
        # the next part is borrowed from gabrielflor.it
        kClusters = {}
        for j in [0..num-1]
            kClusters[j] = []
        for i in [0..n-1]
            cluster = assignments[i]
            kClusters[cluster].push values[i]
        tmpKMeansBreaks = []
        for j in [0..num-1]
            tmpKMeansBreaks.push kClusters[j][0]
            tmpKMeansBreaks.push kClusters[j][kClusters[j].length-1]
        tmpKMeansBreaks = tmpKMeansBreaks.sort (a,b)->
            a-b
        limits.push tmpKMeansBreaks[0]
        for i in [1..tmpKMeansBreaks.length-1] by 2
            if not isNaN(tmpKMeansBreaks[i])
                limits.push tmpKMeansBreaks[i]
    limits



hsi2rgb = (h,s,i) ->
    ###
    borrowed from here:
    http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/hsi2rgb.cpp
    ###
    [h,s,i] = unpack arguments

    # normalize hue
    #h += 360 if h < 0
    #h -= 360 if h > 360
    h /= 360
    if h < 1/3
        b = (1-s)/3
        r = (1+s*cos(TWOPI*h)/cos(PITHIRD-TWOPI*h))/3
        g = 1 - (b+r)
    else if h < 2/3
        h -= 1/3
        r = (1-s)/3
        g = (1+s*cos(TWOPI*h)/cos(PITHIRD-TWOPI*h))/3
        b = 1 - (r+g)
    else
        h -= 2/3
        g = (1-s)/3
        b = (1+s*cos(TWOPI*h)/cos(PITHIRD-TWOPI*h))/3
        r = 1 - (g+b)
    r = limit i*r*3
    g = limit i*g*3
    b = limit i*b*3
    [r*255,g*255,b*255]


rgb2hsi = () ->
    ###
    borrowed from here:
    http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/rgb2hsi.cpp
    ###
    [r,g,b] = unpack arguments
    TWOPI = Math.PI*2
    r /= 255
    g /= 255
    b /= 255
    min = Math.min(r,g,b)
    i = (r+g+b) / 3
    s = 1 - min/i
    if s == 0
        h = 0
    else
        h = ((r-g)+(r-b)) / 2
        h /= Math.sqrt((r-g)*(r-g) + (r-b)*(g-b))
        h = Math.acos(h)
        if b > g
            h = TWOPI - h
        h /= TWOPI
    [h*360,s,i]



chroma.hsi = () ->
    new Color arguments..., 'hsi'

_input.hsi = hsi2rgb

Color::hsi = () ->
    rgb2hsi @_rgb




interpolate_hsx = (col1, col2, f, m) ->
    if m == 'hsl'
        xyz0 = col1.hsl()
        xyz1 = col2.hsl()
    else if m == 'hsv'
        xyz0 = col1.hsv()
        xyz1 = col2.hsv()
    else if m == 'hsi'
        xyz0 = col1.hsi()
        xyz1 = col2.hsi()
    else if m == 'lch'
        xyz0 = col1.lch()
        xyz1 = col2.lch()

    if m.substr(0, 1) == 'h'
        [hue0, sat0, lbv0] = xyz0
        [hue1, sat1, lbv1] = xyz1
    else
        [lbv0, sat0, hue0] = xyz0
        [lbv1, sat1, hue1] = xyz1

    if not isNaN(hue0) and not isNaN(hue1)
        if hue1 > hue0 and hue1 - hue0 > 180
            dh = hue1-(hue0+360)
        else if hue1 < hue0 and hue0 - hue1 > 180
            dh = hue1+360-hue0
        else
            dh = hue1 - hue0
        hue = hue0+f*dh
    else if not isNaN(hue0)
        hue = hue0
        sat = sat0 if (lbv1 == 1 or lbv1 == 0) and m != 'hsv'
    else if not isNaN(hue1)
        hue = hue1
        sat = sat1 if (lbv0 == 1 or lbv0 == 0) and m != 'hsv'
    else
        hue = Number.NaN

    sat ?= sat0 + f*(sat1 - sat0)
    lbv = lbv0 + f*(lbv1-lbv0)

    if m.substr(0, 1) == 'h'
        res = new Color hue, sat, lbv, m
    else
        res = new Color lbv, sat, hue, m

_interpolators = _interpolators.concat ([m, interpolate_hsx] for m in ['hsv','hsl','hsi','lch'])


interpolate_num = (col1, col2, f, m) ->
    n1 = col1.num()
    n2 = col2.num()
    chroma.num n1 + (n2-n1) * f, 'num'

_interpolators.push ['num', interpolate_num]


interpolate_lab = (col1, col2, f, m) ->
	xyz0 = col1.lab()
	xyz1 = col2.lab()
	res = new Color(
	    xyz0[0] + f * (xyz1[0]-xyz0[0]),
	    xyz0[1] + f * (xyz1[1]-xyz0[1]),
	    xyz0[2] + f * (xyz1[2]-xyz0[2]),
	    m
	)

_interpolators.push ['lab', interpolate_lab]



