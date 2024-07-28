import '../io/hsi/index.js';
import interpolate_hsx from './_hsx.js';
import index from './index.js';

const hsi = (col1, col2, f) => {
    return interpolate_hsx(col1, col2, f, 'hsi');
};

// register interpolator
index.hsi = hsi;

export default hsi;
