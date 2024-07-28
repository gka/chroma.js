import { unpack } from '../../utils/index.js';
import rgb2lab from '../lab/rgb2lab.js';
import lab2lch from './lab2lch.js';

const rgb2lch = (...args) => {
    const [r, g, b] = unpack(args, 'rgb');
    const [l, a, b_] = rgb2lab(r, g, b);
    return lab2lch(l, a, b_);
};

export default rgb2lch;
