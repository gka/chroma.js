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
    dh = 0
    if type(lightness) == 'array'
        dl = lightness[1] - lightness[0]
    else
        dl = 0
        lightness = [lightness, lightness]

    f = (fract) ->
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
    
    f.start = (s) ->
        if not s? then return start
        start = s
        f
    
    f.rotations = (r) ->
        if not r? then return rotations
        rotations = r
        f

    f.gamma = (g) ->
        if not g? then return gamma
        gamma = g
        f

    f.hue = (h) ->
        if not h? then return hue
        hue = h
        if type(hue) == 'array'
            dh = hue[1] - hue[0]
            hue = hue[1] if dh == 0
        else
            dh = 0
        f

    f.lightness = (h) ->
        if not h? then return lightness
        if type(h) == 'array'
            lightness = h
            dl = h[1] - h[0]
        else
            lightness = [h,h]
            dl = 0
        f
    
    f.scale = () ->
        chroma.scale f

    f.hue hue

    f
