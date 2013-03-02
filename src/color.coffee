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

root = (exports ? this)
chroma = root.chroma ?= {}

# Browserify-compatible export
module.exports = chroma if module?

chroma.version = "0.3.1"

class Color
    ###
    data type for colors

    eg.
    new Color() // white
    new Color(120,.8,.5) // defaults to hsl color
    new Color([120,.8,.5]) // this also works
    new Color(255,100,50,'rgb') //  color using RGB
    new Color('#ff0000') // or hex value

    ###
    constructor: (x,y,z,m) ->
        me = @

        if not x? and not y? and not z? and not m?
            x = [255,0,255]

        if type(x) == "array" and x.length == 3
            m ?= y
            [x,y,z] = x

        if type(x) == "string"
            m = 'hex'
        else
            m ?= 'rgb'

        if m == 'rgb'
            me._rgb = [x,y,z]
        else if m == 'hsl'
            me._rgb = hsl2rgb x,y,z
        else if m == 'hsv'
            me._rgb = hsv2rgb x,y,z
        else if m == 'hex'
            me._rgb = hex2rgb x
        else if m == 'lab'
            me._rgb = lab2rgb x,y,z
        else if m == 'lch'
            me._rgb = lch2rgb x,y,z
        else if m == 'hsi'
            me._rgb = hsi2rgb x,y,z

    rgb: ->
        @_rgb

    hex: ->
        rgb2hex @_rgb

    toString: ->
        @hex()

    hsl: ->
        rgb2hsl @_rgb

    hsv: ->
        rgb2hsv @_rgb

    lab: ->
        rgb2lab @_rgb

    lch: ->
        rgb2lch @_rgb

    hsi: ->
        rgb2hsi @_rgb

    interpolate: (f, col, m) ->
        ###
        interpolates between colors
        ###
        me = @
        m ?= 'rgb'
        col = new Color(col) if type(col) == "string"

        if m == 'hsl' or m == 'hsv' or m == 'lch' or m == 'hsi'
            if m == 'hsl'
                xyz0 = me.hsl()
                xyz1 = col.hsl()
            else if m == 'hsv'
                xyz0 = me.hsv()
                xyz1 = col.hsv()
            else if m == 'lch'
                xyz0 = me.lch()
                xyz1 = col.lch()
            else if m == 'hsi'
                xyz0 = me.hsi()
                xyz1 = col.hsi()

            [hue0, sat0, lbv0] = xyz0
            [hue1, sat1, lbv1] = xyz1

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
                sat = sat0 if lbv1 == 1 or lbv1 == 0
            else if not isNaN(hue1)
                hue = hue1
                sat = sat1 if lbv0 == 1 or lbv0 == 0
            else
                hue = undefined

            sat ?= sat0 + f*(sat1 - sat0)

            lbv = lbv0 + f*(lbv1-lbv0)

            new Color(hue, sat, lbv, m)

        else if m == 'rgb'
            xyz0 = me._rgb
            xyz1 = col._rgb
            new Color(xyz0[0]+f*(xyz1[0]-xyz0[0]), xyz0[1] + f*(xyz1[1]-xyz0[1]), xyz0[2] + f*(xyz1[2]-xyz0[2]), m)

        else if m == 'lab'
            xyz0 = me.lab()
            xyz1 = col.lab()
            new Color(xyz0[0]+f*(xyz1[0]-xyz0[0]), xyz0[1] + f*(xyz1[1]-xyz0[1]), xyz0[2] + f*(xyz1[2]-xyz0[2]), m)

        else
            throw "color mode "+m+" is not supported"

    darken: (amount=0.2) ->
        me = @
        lch = me.lch()
        lch[2] -= amount
        chroma.lch lch


hex2rgb = (hex) ->
    if not hex.match /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
        if chroma.colors? and chroma.colors[hex]
            hex = chroma.colors[hex]
        else
            throw "unknown color format: "+hex
    if hex.length == 4 or hex.length == 7
        hex = hex.substr(1)
    if hex.length == 3
        hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]
    u = parseInt(hex, 16)
    r = u >> 16
    g = u >> 8 & 0xFF
    b = u & 0xFF
    [r,g,b]

_unpack = (args) ->
    if args.length == 3
        args
    else
        args[0]

rgb2hex = () ->
    [r,g,b] = _unpack(arguments)
    u = r << 16 | g << 8 | b
    str = "000000" + u.toString(16).toUpperCase()
    "#" + str.substr(str.length - 6)


hsv2rgb = () ->
    [h,s,v] = _unpack(arguments)
    v *= 255
    if s is 0 and isNaN(h)
        r = g = b = v
    else
        h = 0 if h is 360
        h -= 360 if h > 360
        h += 360 if h < 0
        h /= 60
        i = Math.floor h
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
    r = Math.round r
    g = Math.round g
    b = Math.round b
    [r, g, b]


rgb2hsv = () ->
    [r,g,b] = _unpack(arguments)
    min = Math.min(r, g, b)
    max = Math.max(r, g, b)
    delta = max - min
    v = max / 255.0
    s = delta / max
    if s is 0
        h = undefined
        s = 0
    else
        if r is max then h = (g - b) / delta
        if g is max then h = 2+(b - r) / delta
        if b is max then h = 4+(r - g) / delta
        h *= 60;
        if h < 0 then h += 360
    [h, s, v]


hsl2rgb = () ->
    [h,s,l] = _unpack(arguments)
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
        [r,g,b] = [Math.round(c[0]*255),Math.round(c[1]*255),Math.round(c[2]*255)]
    [r,g,b]


rgb2hsl = (r,g,b) ->
    if r != undefined and r.length == 3
        [r,g,b] = r
    r /= 255
    g /= 255
    b /= 255
    min = Math.min(r, g, b)
    max = Math.max(r, g, b)

    l = (max + min) / 2

    if max == min
        s = 0
        h = undefined
    else
        s = if l < 0.5 then (max - min) / (max + min) else (max - min) / (2 - max - min)

    if r == max then h = (g - b) / (max - min)
    else if (g == max) then h = 2 + (b - r) / (max - min)
    else if (b == max) then h = 4 + (r - g) / (max - min)

    h *= 60;
    h += 360 if h < 0
    [h,s,l]


# Corresponds roughly to RGB brighter/darker
K = 18

# D65 standard referent
X = 0.950470
Y = 1
Z = 1.088830

lab2rgb = (l,a,b) ->
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
    x = lab_xyz(x) * X
    y = lab_xyz(y) * Y
    z = lab_xyz(z) * Z
    [
        xyz_rgb( 3.2404542 * x - 1.5371385 * y - 0.4985314 * z),
        xyz_rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z),
        xyz_rgb( 0.0556434 * x - 0.2040259 * y + 1.0572252 * z)
    ]


rgb2lab = () ->
    [r,g,b] = _unpack(arguments)
    r = rgb_xyz r
    g = rgb_xyz g
    b = rgb_xyz b
    x = xyz_lab (0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / X
    y = xyz_lab (0.2126729 * r + 0.7151522 * g + 0.0721750 * b) / Y
    z = xyz_lab (0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / Z
    [116 * y - 16, 500 * (x - y), 200 * (y - z)]


lch2lab = () ->
    ###
    Convert from a qualitative parameter h and a quantitative parameter l to a 24-bit pixel. These formulas were invented by David Dalrymple to obtain maximum contrast without going out of gamut if the parameters are in the range 0-1.
    A saturation multiplier was added by Gregor Aisch
    ###
    [l,c,h] = _unpack arguments
    h = h * Math.PI / 180
    [l, Math.cos(h) * c, Math.sin(h) * c]
    # h /= 360.0
    # TAU = 6.283185307179586476925287
    # L = l*0.61+0.09 # L of L*a*b*
    # angle = TAU/6.0-h*TAU
    # r = (l*0.311+0.125)*c # ~chroma
    # a = Math.sin(angle)*r
    # b = Math.cos(angle)*r
    # [L,a,b]


lch2rgb = (l,c,h) ->
    [L,a,b] = lch2lab(l,c,h)
    lab2rgb(L,a,b)

lab_xyz = (x) ->
    if x > 0.206893034 then x * x * x else (x - 4 / 29) / 7.787037

xyz_lab = (x) ->
    if x > 0.008856 then Math.pow(x, 1 / 3) else 7.787037 * x + 4 / 29

xyz_rgb = (r) ->
    Math.round(255 * (if r <= 0.00304 then 12.92 * r else 1.055 * Math.pow(r, 1 / 2.4) - 0.055))

rgb_xyz = (r) ->
    if (r /= 255) <= 0.04045 then r / 12.92 else Math.pow((r + 0.055) / 1.055, 2.4)



# xyz2rgb = (x,y,z) ->
#     ###
#     Convert from XYZ doubles to sRGB bytes
#     Formulas drawn from http://en.wikipedia.org/wiki/Srgb
#     ###
#     if type(x) == "array" and x.length == 3
#         [x,y,z] = x

#     rl =  3.2406*x - 1.5372*y - 0.4986*z
#     gl = -0.9689*x + 1.8758*y + 0.0415*z
#     bl =  0.0557*x - 0.2040*y + 1.0570*z
#     clip = Math.min(rl,gl,bl) < -0.001 || Math.max(rl,gl,bl) > 1.001
#     if clip
#         rl = if rl<0.0 then 0.0 else if rl>1.0 then 1.0 else rl
#         gl = if gl<0.0 then 0.0 else if gl>1.0 then 1.0 else gl
#         bl = if bl<0.0 then 0.0 else if bl>1.0 then 1.0 else bl

#     # Uncomment the below to detect clipping by making clipped zones red.
#     if clip
#         [rl,gl,bl] = [undefined,undefined,undefined]

#     correct = (cl) ->
#         a = 0.055
#         if cl<=0.0031308 then 12.92*cl else (1+a)*Math.pow(cl,1/2.4)-a

#     r = Math.round 255.0*correct(rl)
#     g = Math.round 255.0*correct(gl)
#     b = Math.round 255.0*correct(bl)

#     [r,g,b]






rgb2xyz = (r,g,b) ->
    if r != undefined and r.length == 3
        [r,g,b] = r

    correct = (c) ->
        a = 0.055
        if c <= 0.04045 then c/12.92 else Math.pow((c+a)/(1+a), 2.4)

    rl = correct(r/255.0)
    gl = correct(g/255.0)
    bl = correct(b/255.0)

    x = 0.4124 * rl + 0.3576 * gl + 0.1805 * bl
    y = 0.2126 * rl + 0.7152 * gl + 0.0722 * bl
    z = 0.0193 * rl + 0.1192 * gl + 0.9505 * bl
    [x,y,z]

# xyz2lab = (x,y,z) ->
#     # 6500K color templerature
#     if x != undefined and x.length == 3
#         [x,y,z] = x

#     ill = [0.96421, 1.00000, 0.82519]
#     f = (t) ->
#         if t > Math.pow(6.0/29.0,3) then Math.pow(t, 1/3) else (1/3)*(29/6)*(29/6)*t+4.0/29.0
#     l = 1.16 * f(y/ill[1]) - 0.16
#     a = 5 * (f(x/ill[0]) - f(y/ill[1]))
#     b = 2 * (f(y/ill[1]) - f(z/ill[2]))
#     [l,a,b]


lab2lch = () ->
    [l, a, b] = _unpack arguments
    c = Math.sqrt(a * a + b * b)
    h = Math.atan2(b, a) / Math.PI * 180
    [l, c, h]


# lab2hcl = (l,a,b) ->
#     ###
#     Convert from a qualitative parameter c and a quantitative parameter l to a 24-bit pixel. These formulas were invented by David Dalrymple to obtain maximum contrast without going out of gamut if the parameters are in the range 0-1.

#     A saturation multiplier was added by Gregor Aisch
#     ###
#     if type(l) == "array" and l.length == 3
#         [l,a,b] = l
#     L = l
#     l = (l-0.09) / 0.61

#     r = Math.sqrt(a*a + b*b)
#     s = r / (l*0.311+0.125)

#     TAU = 6.283185307179586476925287

#     angle = Math.atan2(a,b)

#     c = (TAU/6 - angle) / TAU
#     c *= 360
#     c += 360 if c < 0
#     [c,s,l]


rgb2lch = () ->
    [r,g,b] = _unpack arguments
    [l,a,b] = rgb2lab r,g,b
    lab2lch l,a,b


rgb2hsi = (r,g,b) ->
    ###
    borrowed from here:
    http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/rgb2hsi.cpp
    ###
    if type(r) == "array" and r.length == 3
        [r,g,b] = r
    TWOPI = Math.PI*2
    r /= 255
    g /= 255
    b /= 255
    min = Math.min(r,g,b)
    i = (r+g+b)/3
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


hsi2rgb = (h,s,i) ->
    ###
    borrowed from here:
    http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/hsi2rgb.cpp
    ###
    if type(h) == "array" and h.length == 3
        [h,s,i] = h
    TWOPI = Math.PI*2
    PITHIRD = Math.PI/3
    cos = Math.cos

    # normalize hue
    h += 360 if h < 0
    h -= 360 if h > 360

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
    r = i*r*3
    g = i*g*3
    b = i*b*3
    [r*255,g*255,b*255]


chroma.Color = Color

#
# static constructors
#

chroma.hsl = (h,s,l) ->
    new Color(h,s,l,'hsl')

chroma.hsv = (h,s,v) ->
    new Color(h,s,v,'hsv')

chroma.rgb = (r,g,b) ->
    new Color(r,g,b,'rgb')

chroma.hex = (x) ->
    new Color(x)

chroma.lab = (l,a,b) ->
    new Color(l,a,b,'lab')

chroma.lch = (l,c,h) ->
    new Color(l,c,h, 'lch')

chroma.hsi = (h,s,i) ->
    new Color(h,s,i,'hsi')

chroma.interpolate = (a,b,f,m) ->
    if not a? or not b?
        return '#000'
    a = new Color(a) if type(a) == 'string'
    b = new Color(b) if type(b) == 'string'
    a.interpolate(f,b,m)



