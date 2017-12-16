# @require utils api

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
        mode = args[args.length-1] if args.length > 1

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

    toString: ->
        @hex()

    clone: ->
        chroma(me._rgb)


chroma._input = _input
