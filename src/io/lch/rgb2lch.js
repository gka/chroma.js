import { unpack } from '../../utils/index.js';
import rgb2lab from '../lab/rgb2lab.js';
import lab2lch from './lab2lch.js';

const rgb2lch = (...args) => {
    const [r, g, b, ...rest] = unpack(args, 'rgb');
    const [l, a, b_] = rgb2lab(r, g, b);
    const [L, c, h] = lab2lch(l, a, b_);
    return [L, c, h, ...(rest.length > 0 && rest[0] < 1 ? [rest[0]] : [])];
};

export default rgb2lch;
