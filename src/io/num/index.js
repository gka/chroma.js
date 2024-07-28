import chroma from '../../chroma.js';
import Color from '../../Color.js';
import input from '../input.js';
import { type } from '../../utils/index.js';
import num2rgb from './num2rgb.js';
import rgb2num from './rgb2num.js';

Color.prototype.num = function () {
    return rgb2num(this._rgb);
};

chroma.num = (...args) => new Color(...args, 'num');

input.format.num = num2rgb;

input.autodetect.push({
    p: 5,
    test: (...args) => {
        if (
            args.length === 1 &&
            type(args[0]) === 'number' &&
            args[0] >= 0 &&
            args[0] <= 0xffffff
        ) {
            return 'num';
        }
    }
});
