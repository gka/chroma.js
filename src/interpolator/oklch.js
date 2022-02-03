require('../io/lch');
const interpolate_hsx = require('./_hsx');

const oklch = (col1, col2, f) => {
    return interpolate_hsx(col1, col2, f, 'oklch');
};

// register interpolator
require('./index').oklch = oklch;

module.exports = oklch;
