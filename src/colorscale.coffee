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

root = (exports ? this)
chroma = root.chroma ?= {}

Color = chroma.Color

class ColorScale
    ###
    base class for color scales
    ###
    constructor: (opts={}) ->
        me = @
        me.range opts.colors, opts.positions
        me._mode = opts.mode ? 'rgb'
        me._nacol = chroma.hex opts.nacol ? chroma.hex '#ccc'
        me.domain [0, 1]
        me

    range: (colors, positions) ->
        me = @
        if not colors?
            colors = ['#ddd', '#222']
        if colors? and type(colors) == 'string' and chroma.brewer?[colors]?
            colors = chroma.brewer[colors].slice(0)
        # convert to chroma classes
        for c in [0..colors.length-1]
            col = colors[c]
            colors[c] = new Color(col) if type(col) == "string"
        me._colors = colors
        # auto-fill color position
        if positions?
            me._pos = positions
        else
            me._pos = []
            for c in [0..colors.length-1]
                me._pos.push c/(colors.length-1)
        me

    domain: (domain = []) ->
        ###
        # use this if you want to display a limited number of data classes
        # possible methods are "equalinterval", "quantiles", "custom"
        ###
        me = @
        me._domain = domain
        me._min = domain[0]
        me._max = domain[domain.length-1]
        if domain.length == 2
            me._numClasses = 0
        else
            me._numClasses = domain.length-1
        me

    get: (value) ->
        me = @
        if isNaN(value) then return me._nacol
        if me._domain.length > 2
            c = me.getClass value
            f = c/(me._numClasses-1)
        else
            f = f0 = (value - me._min) / (me._max - me._min)
            f = Math.min(1, Math.max(0, f))

        me.fColor f

    fColor: (f) ->
        me = @
        cols = me._colors
        for i in [0..me._pos.length-1]
            p = me._pos[i]
            if f <= p
                col = cols[i]
                break
            if f >= p and i == me._pos.length-1
                col = cols[i]
                break
            if f > p and f < me._pos[i+1]
                f = (f-p)/(me._pos[i+1]-p)
                col = chroma.interpolate cols[i], cols[i+1], f, me._mode
                break
        col

    classifyValue: (value) ->
        me = @
        domain = me._domain
        val = value
        if domain.length > 2
            n = domain.length-1
            i = me.getClass(value)
            val = domain[i] + (domain[i+1] - domain[i]) * 0.5
            #console.log '-', val
            minc = domain[0] # + (domain[1]-domain[0])*0.3
            maxc = domain[n-1] # + (domain[n]-domain[n-1])*0.7
            val = me._min + ((val - minc) / (maxc-minc)) * (me._max - me._min)
        val

    getClass: (value) ->
        self = @
        domain = self._domain
        if domain?
            n = domain.length-1
            i = 0
            while i < n and value >= domain[i]
                i++
            return i-1
        return 0

    validValue: (value) ->
        not isNaN(value)


chroma.ColorScale = ColorScale


# minimal multi-purpose interface
chroma.scale = (colors, positions) ->
    colscale = new chroma.ColorScale()
    colscale.range colors, positions
    out = false
    f = (v) ->
        c = colscale.get v
        if out and c[out] then c[out]() else c
    f.domain = (domain, classes, mode='e', key) ->
        if classes?
            d = chroma.analyze domain, key
            if classes == 0
                domain = [d.min, d.max]
            else
                domain = chroma.limits d, mode, classes
        colscale.domain domain
        f
    f.mode = (_m) ->
        colscale._mode = _m
        f
    f.range = (_colors, _pos) ->
        colscale.range _colors, _pos
        f
    f.out = (_o) ->
        out = _o
        f
    f.getColor = (val) ->
        # introduced for backward compatiblity
        f val
    f

# some pre-defined color scales:
chroma.scales ?= {}

chroma.scales.cool = ->
    chroma.scale [chroma.hsl(180,1,.9), chroma.hsl(250,.7,.4)]

chroma.scales.hot = ->
    chroma.scale(['#000','#f00','#ff0','#fff'], [0,.25,.75,1]).mode('rgb')

