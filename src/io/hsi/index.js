import { unpack, type } from '../../utils/index.js';
import chroma from '../../chroma.js';
import Color from '../../Color.js';
import input from '../input.js';
import hsi2rgb from './hsi2rgb.js';
import rgb2hsi from './rgb2hsi.js';

Color.prototype.hsi = function () {
    return rgb2hsi(this._rgb);
};

chroma.hsi = (...args) => new Color(...args, 'hsi');

input.format.hsi = hsi2rgb;

input.autodetect.push({
    p: 2,
    test: (...args) => {
        args = unpack(args, 'hsi');
        if (type(args) === 'array' && args.length === 3) {
            return 'hsi';
        }
    }
});
