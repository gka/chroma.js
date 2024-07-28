import '../io/hsv/index.js';
import interpolate_hsx from './_hsx.js';
import index from './index.js';

const hsv = (col1, col2, f) => {
    return interpolate_hsx(col1, col2, f, 'hsv');
};

// register interpolator
index.hsv = hsv;

export default hsv;
