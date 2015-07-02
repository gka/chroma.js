
chroma.contrast = (a, b) ->
    # WCAG contrast ratio
    # see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
    a = new Color a if type(a) in ['string', 'number']
    b = new Color b if type(b) in ['string', 'number']
    l1 = a.luminance()
    l2 = b.luminance()
    if l1 > l2 then (l1 + 0.05) / (l2 + 0.05) else (l2 + 0.05) / (l1 + 0.05)
