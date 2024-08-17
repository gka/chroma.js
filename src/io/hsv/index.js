import { unpack, type } from '../../utils/index.js';
import chroma from '../../chroma.js';
import Color from '../../Color.js';
import input from '../input.js';
import hsv2rgb from './hsv2rgb.js';
import rgb2hsv from './rgb2hsv.js';

Color.prototype.hsv = function () {
    return rgb2hsv(this._rgb);
};

const hsv = (...args) => new Color(...args, 'hsv');
chroma.hsv = hsv;

input.format.hsv = hsv2rgb;

input.autodetect.push({
    p: 2,
    test: (...args) => {
        args = unpack(args, 'hsv');
        if (type(args) === 'array' && args.length === 3) {
            return 'hsv';
        }
    }
});

export { hsv };
