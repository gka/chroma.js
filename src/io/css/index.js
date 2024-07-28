import chroma from '../../chroma.js';
import Color from '../../Color.js';
import input from '../input.js';
import { type } from '../../utils/index.js';

import rgb2css from './rgb2css.js';
import css2rgb from './css2rgb.js';

Color.prototype.css = function (mode) {
    return rgb2css(this._rgb, mode);
};

chroma.css = (...args) => new Color(...args, 'css');

input.format.css = css2rgb;

input.autodetect.push({
    p: 5,
    test: (h, ...rest) => {
        if (!rest.length && type(h) === 'string' && css2rgb.test(h)) {
            return 'css';
        }
    }
});
