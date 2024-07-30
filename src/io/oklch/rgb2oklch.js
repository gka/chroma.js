import { unpack } from '../../utils/index.js';
import rgb2oklab from '../oklab/rgb2oklab.js';
import lab2lch from '../lch/lab2lch.js';

const rgb2oklch = (...args) => {
    const [r, g, b] = unpack(args, 'rgb');
    const [l, a, b_] = rgb2oklab(r, g, b);
    return lab2lch(l, a, b_);
};

export default rgb2oklch;
