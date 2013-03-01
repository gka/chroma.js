###*
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
###

root = (exports ? this)
chroma = root.chroma ?= {}


Color = chroma.Color


class ColorScale
    ###
    base class for color scales
    ###
    constructor: (opts) ->
        me = @
        me._colors = cols = opts.colors ? ['#ddd', '#222']
        for c in [0..cols.length-1]
            col = cols[c]
            cols[c] = new Color(col) if type(col) == "string"

        if opts.positions?
            me._pos = opts.positions
        else
            me._pos = []
            for c in [0..cols.length-1]
                me._pos.push c/(cols.length-1)

        me._mode = opts.mode ? 'hsv'
        me._nacol = chroma.hex opts.nacol ? chroma.hex '#ccc'
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
                col = chroma.interpolate cols[i], cols[i+1], f, me.mode
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


class Ramp extends ColorScale

    constructor: (col0='#fe0000', col1='#feeeee', mode='hsl') ->
        super
            colors: [col0, col1]
            positions: [0,1]
            mode: mode

chroma.Ramp = Ramp

chroma.ramp = (col0, col1, mode) ->
    s = new chroma.Ramp col0, col1, mode
    s.getColor


class Diverging extends ColorScale

    constructor: (colors=['#d73027', '#ffffbf', '#1E6189'], center=0, mode='hsl') ->
        me = @
        me._center = center
        super
            colors: colors
            positions: [0,.5,1]
            mode: mode
        me

    domain: (domain = []) ->
        me = @
        super domain
        me._pos[1] = (me._center - domain[0]) / (domain[domain.length-1] - domain[0])
        me


chroma.Diverging = Diverging

chroma.diverging = (col0, col1, col2, center, mode) ->
    s = new chroma.Diverging col0, col1, col2, center, mode
    s.getColor


class Categories extends ColorScale

    constructor: (colors) ->
        # colors: dictionary of id: colors
        me = @
        me.colors = colors

    parseData: (data, data_col) ->
        # nothing to do here..

    getColor: (value) ->
        me = @
        if me.colors.hasOwnProperty value
            return me.colors[value]
        else
            return '#cccccc'

    validValue: (value) ->
        @colors.hasOwnProperty value

chroma.Categories = Categories


class CSSColors extends ColorScale

    constructor: (name) ->
        me = @
        me.name = name
        me.setClasses(7)
        me

    getColor: (value) ->
        me = @
        c = me.getClass(value)
        me.name + ' l'+me.numClasses+' c'+c

chroma.CSSColors = CSSColors


# some pre-defined color scales:
chroma.scales ?= {}

chroma.scales.cool = ->
    new Ramp(chroma.hsl(180,1,.9), chroma.hsl(250,.7,.4))

chroma.scales.hot = ->
    new ColorScale
        colors: ['#000000','#ff0000','#ffff00','#ffffff']
        positions: [0,.25,.75,1]
        mode: 'rgb'

chroma.scales.BlWhOr = ->
    new Diverging(chroma.hsl(30,1,.55),'#ffffff', new Color(220,1,.55))

chroma.scales.GrWhPu = ->
    new Diverging(chroma.hsl(120,.8,.4),'#ffffff', new Color(280,.8,.4))


