const { unpack } = require('../../utils');
const lch2lab = require('../lch/lch2lab');
const oklab2rgb = require('../oklab/oklab2rgb');

const oklch2rgb = (...args) => {
    args = unpack(args, 'lch');
    const [l, c, h] = args;
    const [L, a, b_] = lch2lab(l, c, h);
    const [r, g, b] = oklab2rgb(L, a, b_);
    return [r, g, b, args.length > 3 ? args[3] : 1];
};

module.exports = oklch2rgb;
