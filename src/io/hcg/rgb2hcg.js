const {unpack} = require('../../utils');

const rgb2hcg = (...args) => {
    const [r,g,b] = unpack(args, 'rgb').map(x => x / 255);
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    const delta = max - min;
    const _g = min / (1 - delta);
    let h;
    if (delta === 0) {
        h = Number.NaN
    } else {
        if (r === max) h = (g - b) / delta;
        if (g === max) h = 2+(b - r) / delta;
        if (b === max) h = 4+(r - g) / delta;
        h *= 60;
        if (h < 0) h += 360
    }
    return [h, delta, _g];
}

module.exports = rgb2hcg;
