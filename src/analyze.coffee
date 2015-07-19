

chroma.analyze = (data) ->
    r =
        min: Number.MAX_VALUE
        max: Number.MAX_VALUE*-1
        sum: 0
        values: []
        count: 0

    for val in data
        if val? and not isNaN val
            r.values.push val
            r.sum += val
            r.min = val if val < r.min
            r.max = val if val > r.max
            r.count += 1

    r.domain = [r.min, r.max]

    r.limits = (mode, num) ->
        chroma.limits r, mode, num
    
    r
