import '../io/lch/index.js';
import interpolate_hsx from './_hsx.js';
import index from './index.js';

const oklch = (col1, col2, f) => {
    return interpolate_hsx(col1, col2, f, 'oklch');
};

// register interpolator
index.oklch = oklch;

export default oklch;
