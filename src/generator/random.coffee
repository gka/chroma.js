

chroma.random = ->
    digits = '0123456789abcdef'
    code = '#'
    code += digits.charAt(floor(Math.random() * 16)) for i in [0...6]
    new Color code