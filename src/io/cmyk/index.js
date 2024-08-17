import chroma from '../../chroma.js';
import Color from '../../Color.js';
import input from '../input.js';
import { unpack, type } from '../../utils/index.js';
import cmyk2rgb from './cmyk2rgb.js';
import rgb2cmyk from './rgb2cmyk.js';

Color.prototype.cmyk = function () {
    return rgb2cmyk(this._rgb);
};

const cmyk = (...args) => new Color(...args, 'cmyk');
Object.assign(chroma, { cmyk });

input.format.cmyk = cmyk2rgb;

input.autodetect.push({
    p: 2,
    test: (...args) => {
        args = unpack(args, 'cmyk');
        if (type(args) === 'array' && args.length === 4) {
            return 'cmyk';
        }
    }
});

export { cmyk };
