import '../io/hcg/index.js';
import interpolate_hsx from './_hsx.js';
import index from './index.js';

const hcg = (col1, col2, f) => {
    return interpolate_hsx(col1, col2, f, 'hcg');
};

// register interpolator
index.hcg = hcg;

export default hcg;
