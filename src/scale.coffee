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
    _numClasses = 0

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
        _colors = colors

    setDomain = (domain = []) ->
        ###
        # use this if you want to display a limited number of data classes
        # possible methods are "equalinterval", "quantiles", "custom"
        ###
        _domain = domain
        _min = domain[0]
        _max = domain[domain.length-1]
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

    classifyValue = (value) ->
        val = value
        if _domain.length > 2
            n = _domain.length-1
            i = getClass(value)
            minc = _domain[0] + (_domain[1]-_domain[0]) * (0 + _spread * 0.5)  # center of 1st class
            maxc = _domain[n-1] + (_domain[n]-_domain[n-1]) * (1 - _spread * 0.5)  # center of last class
            val = _min + ((_domain[i] + (_domain[i+1] - _domain[i]) * 0.5 - minc) / (maxc-minc)) * (_max - _min)
        val

    getColor = (val) ->
        if isNaN(val) then return _nacol
        if _domain.length > 2
            c = getClass val
            f = c / (_numClasses-1)
        else
            f = f0 = (val - _min) / (_max - _min)
            f = Math.min(1, Math.max(0, f))

        if type(_colors) == 'array'
            for i in [0.._pos.length-1]
                p = _pos[i]
                if f <= p
                    col = _colors[i]
                    break
                if f >= p and i == _pos.length-1
                    col = _colors[i]
                    break
                if f > p and f < _pos[i+1]
                    f = (f-p)/(_pos[i+1]-p)
                    col = chroma.interpolate _colors[i], _colors[i+1], f, _mode
                    break
        else if type(_colors) == 'function'
            col = _colors f
        col

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

    f

# some pre-defined color scales:
chroma.scales ?= {}

chroma.scales.cool = ->
    chroma.scale [chroma.hsl(180,1,.9), chroma.hsl(250,.7,.4)]

chroma.scales.hot = ->
    chroma.scale(['#000','#f00','#ff0','#fff'], [0,.25,.75,1]).mode('rgb')

