import { unpack } from '../../utils/index.js';
import lch2lab from '../lch/lch2lab.js';
import oklab2rgb from '../oklab/oklab2rgb.js';

const oklch2rgb = (...args) => {
    args = unpack(args, 'lch');
    const [l, c, h] = args;
    const [L, a, b_] = lch2lab(l, c, h);
    const [r, g, b] = oklab2rgb(L, a, b_);
    return [r, g, b, args.length > 3 ? args[3] : 1];
};

export default oklch2rgb;
