import { unpack, type, reverse3 } from '../../utils/index.js';
import chroma from '../../chroma.js';
import Color from '../../Color.js';
import input from '../input.js';
import lch2rgb from './lch2rgb.js';
import hcl2rgb from './hcl2rgb.js';
import rgb2lch from './rgb2lch.js';

Color.prototype.lch = function () {
    return rgb2lch(this._rgb);
};
Color.prototype.hcl = function () {
    return reverse3(rgb2lch(this._rgb));
};

const lch = (...args) => new Color(...args, 'lch');
const hcl = (...args) => new Color(...args, 'hcl');

Object.assign(chroma, { lch, hcl });

input.format.lch = lch2rgb;
input.format.hcl = hcl2rgb;
['lch', 'hcl'].forEach((m) =>
    input.autodetect.push({
        p: 2,
        test: (...args) => {
            args = unpack(args, m);
            if (type(args) === 'array' && args.length === 3) {
                return m;
            }
        }
    })
);

export { lch, hcl };
