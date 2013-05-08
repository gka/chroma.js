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


class Color

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

        me_rgb = clip_rgb me._rgb

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

    luminance: ->
        luminance @_rgb

    name: ->
        h = @hex()
        for k of chroma.colors
            if h == chroma.colors[k]
                return k
        h

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
            else if m == 'hsi'
                xyz0 = me.hsi()
                xyz1 = col.hsi()
            else if m == 'lch'
                xyz0 = me.lch()
                xyz1 = col.lch()

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
                sat = sat0 if lbv1 == 1 or lbv1 == 0
            else if not isNaN(hue1)
                hue = hue1
                sat = sat1 if lbv0 == 1 or lbv0 == 0
            else
                hue = undefined

            sat ?= sat0 + f*(sat1 - sat0)
            lbv = lbv0 + f*(lbv1-lbv0)

            if m.substr(0, 1) == 'h'
                new Color hue, sat, lbv, m
            else
                new Color lbv, sat, hue, m

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

    darken: (amount=20) ->
        me = @
        lch = me.lch()
        lch[0] -= amount
        chroma.lch lch

    darker: (amount) ->
        @darken amount

    brighten: (amount=20) ->
        @darken -amount

    brighter: (amount) ->
        @brighten amount

    saturate: (amount=20) ->
        me = @
        lch = me.lch()
        lch[1] += amount
        chroma.lch lch

    desaturate: (amount=20) ->
        @saturate -amount



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
        return [r,g,b]

    # check for css colors, too
    if rgb = css2rgb hex
        return rgb

    throw "unknown color: "+hex


css2rgb = (css) ->
    # named X11 colors
    if chroma.colors? and chroma.colors[css]
        return hex2rgb chroma.colors[css]
    # rgb(250,20,0)
    if m = css.match /rgb\(\s*(\-?\d+),\s*(\-?\d+)\s*,\s*(\-?\d+)\s*\)/
        return m.slice 1,4
    # rgb(100%,0%,0%)
    if m = css.match /rgb\(\s*(\-?\d+)%,\s*(\-?\d+)%\s*,\s*(\-?\d+)%\s*\)/
        rgb = m.slice 1,4
        for i of rgb
            rgb[i] = Math.round rgb[i] * 2.55
        return rgb
    if m = css.match /hsl\(\s*(\-?\d+),\s*(\-?\d+)%\s*,\s*(\-?\d+)%\s*\)/
        hsl = m.slice 1,4
        hsl[1] *= 0.01
        hsl[2] *= 0.01
        return hsl2rgb hsl


rgb2hex = () ->
    [r,g,b] = unpack arguments
    u = r << 16 | g << 8 | b
    str = "000000" + u.toString(16) #.toUpperCase()
    "#" + str.substr(str.length - 6)


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
    [r,g,b] = unpack arguments
    min = Math.min(r, g, b)
    max = Math.max(r, g, b)
    delta = max - min
    v = max / 255.0
    if max == 0
        h = undefined
        s = 0
    else
        s = delta / max
        if r is max then h = (g - b) / delta
        if g is max then h = 2+(b - r) / delta
        if b is max then h = 4+(r - g) / delta
        h *= 60;
        if h < 0 then h += 360
    [h, s, v]


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
    r = xyz_rgb( 3.2404542 * x - 1.5371385 * y - 0.4985314 * z)
    g = xyz_rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z)
    b = xyz_rgb( 0.0556434 * x - 0.2040259 * y + 1.0572252 * z)
    [limit(r,0,255), limit(g,0,255), limit(b,0,255)]


rgb2lab = () ->
    [r,g,b] = unpack arguments
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
    [l,c,h] = unpack arguments
    h = h * Math.PI / 180
    [l, Math.cos(h) * c, Math.sin(h) * c]


lch2rgb = (l,c,h) ->
    [L,a,b] = lch2lab l,c,h
    [r,g,b] = lab2rgb L,a,b
    [limit(r,0,255), limit(g,0,255), limit(b,0,255)]

lab_xyz = (x) ->
    if x > 0.206893034 then x * x * x else (x - 4 / 29) / 7.787037

xyz_lab = (x) ->
    if x > 0.008856 then Math.pow(x, 1 / 3) else 7.787037 * x + 4 / 29

xyz_rgb = (r) ->
    Math.round(255 * (if r <= 0.00304 then 12.92 * r else 1.055 * Math.pow(r, 1 / 2.4) - 0.055))

rgb_xyz = (r) ->
    if (r /= 255) <= 0.04045 then r / 12.92 else Math.pow((r + 0.055) / 1.055, 2.4)


lab2lch = () ->
    [l, a, b] = unpack arguments
    c = Math.sqrt(a * a + b * b)
    h = Math.atan2(b, a) / Math.PI * 180
    [l, c, h]


rgb2lch = () ->
    [r,g,b] = unpack arguments
    [l,a,b] = rgb2lab r,g,b
    lab2lch l,a,b


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


clip_rgb = (rgb) ->
    for i of rgb
        rgb[i] = 0 if rgb[i] < 0
        rgb[i] = 255 if rgb[i] > 255
    rgb


luminance = (r,g,b) ->
    # relative luminance
    # see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
    [r,g,b] = unpack arguments
    r = luminance_x r
    g = luminance_x g
    b = luminance_x b
    0.2126 * r + 0.7152 * g + 0.0722 * b


luminance_x = (x) ->
    x /= 255
    if x <= 0.03928 then x/12.92 else Math.pow((x+0.055)/1.055, 2.4)


chroma.Color = Color

#
# static constructors
#

chroma.color = (x,y,z,m) ->
    new Color x,y,z,m

chroma.hsl = (h,s,l) ->
    new Color h,s,l,'hsl'

chroma.hsv = (h,s,v) ->
    new Color h,s,v,'hsv'

chroma.rgb = (r,g,b) ->
    new Color r,g,b,'rgb'

chroma.hex = (x) ->
    new Color x

chroma.css = (x) ->
    new Color x

chroma.lab = (l,a,b) ->
    new Color l,a,b,'lab'

chroma.lch = (l,c,h) ->
    new Color l,c,h, 'lch'

chroma.hsi = (h,s,i) ->
    new Color h,s,i,'hsi'

chroma.interpolate = (a,b,f,m) ->
    if not a? or not b?
        return '#000'
    a = new Color a if type(a) == 'string'
    b = new Color b if type(b) == 'string'
    a.interpolate f,b,m

chroma.contrast = (a, b) ->
    # WCAG contrast ratio
    # see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
    a = new Color a if type(a) == 'string'
    b = new Color b if type(b) == 'string'
    l1 = a.luminance()
    l2 = b.luminance()
    if l1 > l2 then (l1 + 0.05) / (l2 + 0.05) else (l2 + 0.05) / (l1 + 0.05)

