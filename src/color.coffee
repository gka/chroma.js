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


chroma._input = _input
