import '../io/num/index.js';
import index from './index.js';

import Color from '../Color.js';

const num = (col1, col2, f) => {
    const c1 = col1.num();
    const c2 = col2.num();
    return new Color(c1 + f * (c2 - c1), 'num');
};

// register interpolator
index.num = num;

export default num;
