import { unpack, type } from '../../utils/index.js';
import chroma from '../../chroma.js';
import Color from '../../Color.js';
import input from '../input.js';
import oklab2rgb from './oklab2rgb.js';
import rgb2oklab from './rgb2oklab.js';

Color.prototype.oklab = function () {
    return rgb2oklab(this._rgb);
};

chroma.oklab = (...args) => new Color(...args, 'oklab');

input.format.oklab = oklab2rgb;

input.autodetect.push({
    p: 3,
    test: (...args) => {
        args = unpack(args, 'oklab');
        if (type(args) === 'array' && args.length === 3) {
            return 'oklab';
        }
    }
});
