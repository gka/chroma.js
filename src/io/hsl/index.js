import { unpack, type } from '../../utils/index.js';
import chroma from '../../chroma.js';
import Color from '../../Color.js';
import input from '../input.js';
import hsl2rgb from './hsl2rgb.js';
import rgb2hsl from './rgb2hsl.js';

Color.prototype.hsl = function () {
    return rgb2hsl(this._rgb);
};

chroma.hsl = (...args) => new Color(...args, 'hsl');

input.format.hsl = hsl2rgb;

input.autodetect.push({
    p: 2,
    test: (...args) => {
        args = unpack(args, 'hsl');
        if (type(args) === 'array' && args.length === 3) {
            return 'hsl';
        }
    }
});
