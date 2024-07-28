import '../io/lch/index.js';
import interpolate_hsx from './_hsx.js';
import index from './index.js';

const lch = (col1, col2, f) => {
    return interpolate_hsx(col1, col2, f, 'lch');
};

// register interpolator
index.lch = lch;
index.hcl = lch;

export default lch;
