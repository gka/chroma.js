import { unpack } from '../../utils/index.js';
import rgb2oklab from '../oklab/rgb2oklab.js';
import lab2lch from '../lch/lab2lch.js';

const rgb2oklch = (...args) => {
    const [r, g, b, ...rest] = unpack(args, 'rgb');
    const [l, a, b_] = rgb2oklab(r, g, b);
    const [L, c, h] = lab2lch(l, a, b_);
    return [L, c, h, ...(rest.length > 0 && rest[0] < 1 ? [rest[0]] : [])];
};

export default rgb2oklch;
