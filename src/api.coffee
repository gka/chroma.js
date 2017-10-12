
chroma = () ->
    return arguments[0] if arguments[0] instanceof Color
    new Color arguments...
chroma.default = chroma

_interpolators = []

# CommonJS module is defined
module.exports = chroma if module? and module.exports?

if typeof define == 'function' and define.amd
    define [], () -> chroma
else
    root = (exports ? this)
    root.chroma = chroma


chroma.version = '@@version'

# exposing raw classes for testing purposes
