
chroma = (x,y,z,m) ->
    new Color x,y,z,m

# CommonJS module is defined
module.exports = chroma if module? and module.exports?

if typeof define == 'function' and define.amd
    define [], () -> chroma
else
    root = (exports ? this)
    root.chroma = chroma

#
# static constructors
#

chroma.color = (x,y,z,m) ->
    new Color x,y,z,m

chroma.hsl = (h,s,l,a) ->
    new Color h,s,l,a,'hsl'

chroma.hsv = (h,s,v,a) ->
    new Color h,s,v,a,'hsv'

chroma.rgb = (r,g,b,a) ->
    new Color r,g,b,a,'rgb'

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

chroma.gl = (r,g,b,a) ->
    new Color r,g,b,a,'gl'

chroma.num = (n) ->
    new Color n, 'num'

chroma.random = ->
    digits = '0123456789abcdef'
    code = '#'
    code += digits.charAt(Math.floor(Math.random() * 16)) for i in [0...6]
    new Color code

chroma.interpolate = (a,b,f,m) ->
    if not a? or not b?
        return '#000'
    a = new Color a if type(a) in ['string', 'number']
    b = new Color b if type(b) in ['string', 'number']
    a.interpolate f,b,m

chroma.mix = chroma.interpolate

chroma.contrast = (a, b) ->
    # WCAG contrast ratio
    # see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
    a = new Color a if type(a) in ['string', 'number']
    b = new Color b if type(b) in ['string', 'number']
    l1 = a.luminance()
    l2 = b.luminance()
    if l1 > l2 then (l1 + 0.05) / (l2 + 0.05) else (l2 + 0.05) / (l1 + 0.05)

chroma.luminance = (color) ->
    chroma(color).luminance()


# exposing raw classes for testing purposes

chroma._Color = Color
