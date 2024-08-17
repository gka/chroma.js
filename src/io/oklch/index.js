import { unpack, type } from '../../utils/index.js';
import chroma from '../../chroma.js';
import Color from '../../Color.js';
import input from '../input.js';
import oklch2rgb from './oklch2rgb.js';
import rgb2oklch from './rgb2oklch.js';

Color.prototype.oklch = function () {
    return rgb2oklch(this._rgb);
};

const oklch = (...args) => new Color(...args, 'oklch');
Object.assign(chroma, { oklch });

input.format.oklch = oklch2rgb;

input.autodetect.push({
    p: 2,
    test: (...args) => {
        args = unpack(args, 'oklch');
        if (type(args) === 'array' && args.length === 3) {
            return 'oklch';
        }
    }
});

export { oklch };
