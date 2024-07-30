import '../io/hsl/index.js';
import interpolate_hsx from './_hsx.js';
import index from './index.js';

const hsl = (col1, col2, f) => {
    return interpolate_hsx(col1, col2, f, 'hsl');
};

// register interpolator
index.hsl = hsl;

export default hsl;
