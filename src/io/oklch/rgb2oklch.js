const { unpack } = require('../../utils');
const rgb2oklab = require('../oklab/rgb2oklab');
const lab2lch = require('../lch/lab2lch');

const rgb2oklch = (...args) => {
    const [r, g, b] = unpack(args, 'rgb');
    const [l, a, b_] = rgb2oklab(r, g, b);
    return lab2lch(l, a, b_);
};

module.exports = rgb2oklch;
