
chroma.average = (colors, mode='rgb') ->
    l = colors.length
    colors = colors.map (c) -> chroma(c)
    first = colors.splice(0,1)[0]
    xyz = first.get(mode)
    cnt = []
    for i of xyz
        xyz[i] = xyz[i] or 0
        cnt.push if not isNaN(xyz[i]) then 1 else 0 

    alpha = first.alpha() 
    for c in colors
        xyz2 = c.get(mode)
        alpha += c.alpha()
        for i of xyz
            if not isNaN xyz2[i]
                xyz[i] += xyz2[i]
                cnt[i] += 1
    for i of xyz
        xyz[i] = xyz[i]/cnt[i]
    chroma(xyz, mode).alpha(alpha/l)
