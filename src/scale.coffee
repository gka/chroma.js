
# minimal multi-purpose interface

# @requires utils color analyze

chroma.scale = (colors, positions) ->

    # constructor
    _mode = 'rgb'
    _nacol = chroma '#ccc'
    _spread = 0
    _fixed = false
    _domain = [0, 1]
    _pos = []
    _padding = [0,0]
    _classes = false
    _colors = []
    _out = false
    _min = 0
    _max = 1
    _correctLightness = false
    _colorCache = {}

    # private methods

    setColors = (colors) ->
        if not colors?
            colors = ['#fff', '#000']
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
            _pos.length = 0
            for c in [0..colors.length-1]
                _pos.push c/(colors.length-1)
        resetCache()
        _colors = colors

    getClass = (value) ->
        if _classes?
            n = _classes.length-1
            i = 0
            while i < n and value >= _classes[i]
                i++
            return i-1
        return 0

    tmap = (t) -> t

    classifyValue = (value) ->
        val = value
        if _classes.length > 2
            n = _classes.length-1
            i = getClass(value)
            minc = _classes[0] + (_classes[1]-_classes[0]) * (0 + _spread * 0.5)  # center of 1st class
            maxc = _classes[n-1] + (_classes[n]-_classes[n-1]) * (1 - _spread * 0.5)  # center of last class
            val = _min + ((_classes[i] + (_classes[i+1] - _classes[i]) * 0.5 - minc) / (maxc-minc)) * (_max - _min)
        val

    getColor = (val, bypassMap=false) ->
        if isNaN(val) then return _nacol
        if not bypassMap
            if _classes and _classes.length > 2
                # find the class
                c = getClass val
                t = c / (_classes.length-2)
                t = _padding[0] + (t * (1 - _padding[0] - _padding[1]))
            else if _max != _min
                # just interpolate between min/max
                t = (val - _min) / (_max - _min)
                t = _padding[0] + (t * (1 - _padding[0] - _padding[1]))
                t = Math.min(1, Math.max(0, t))
            else
                t = 1
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

    setColors colors

    # public interface

    f = (v) ->
        c = chroma getColor v
        if _out and c[_out] then c[_out]() else c

    f.classes = (classes) ->
        if classes?
            if type(classes) == 'array'
                _classes = classes
                _domain = [classes[0], classes[classes.length-1]]
            else
                d = chroma.analyze _domain
                if classes == 0
                    _classes = [d.min, d.max]
                else
                    _classes = chroma.limits d, 'e', classes
            return f
        _classes


    f.domain = (domain) ->
        if not arguments.length
            return _domain
        _min = domain[0]
        _max = domain[domain.length-1]
        _pos = []
        k = _colors.length
        if domain.length == k and _min != _max
            # update positions
            for d in domain
                _pos.push (d-_min) / (_max-_min)
        else
            for c in [0..k-1]
                _pos.push c/(k-1)
        _domain = [_min, _max]
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

    f.correctLightness = (v=true) ->
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

    f.padding = (p) ->
        if p?
            if type(p) == 'number'
                p = [p,p]
            _padding = p
            f
        else
            _padding

    f.colors = () ->
        numColors = 0
        out = 'hex'
        if arguments.length == 1
            if type(arguments[0]) == 'string'
                out = arguments[0]
            else
                numColors = arguments[0]
        if arguments.length == 2
            [numColors, out] = arguments
        
        if numColors
            dm = _domain[0]
            dd = _domain[1] - dm
            return [0...numColors].map (i) -> f( dm + i/(numColors-1) * dd )[out]()
        
        # returns all colors based on the defined classes
        colors = []
        samples = []
        if _classes and _classes.length > 2
            for i in [1..._classes.length]
                samples.push (_classes[i-1]+_classes[i])*0.5
        else
            samples = _domain
        samples.map (v) -> f(v)[out]()

    f

# some pre-defined color scales:
chroma.scales ?= {}

chroma.scales.cool = ->
    chroma.scale [chroma.hsl(180,1,.9), chroma.hsl(250,.7,.4)]

chroma.scales.hot = ->
    chroma.scale(['#000','#f00','#ff0','#fff'], [0,.25,.75,1]).mode('rgb')

