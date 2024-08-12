import { unpack, type } from '../../utils/index.js';
import chroma from '../../chroma.js';
import Color from '../../Color.js';
import input from '../input.js';
import lab2rgb from './lab2rgb.js';
import rgb2lab from './rgb2lab.js';
import { getLabWhitePoint, setLabWhitePoint } from './lab-constants.js';

Color.prototype.lab = function () {
    return rgb2lab(this._rgb);
};

chroma.lab = (...args) => new Color(...args, 'lab');
chroma.setLabWhitePoint = setLabWhitePoint;
chroma.getLabWhitePoint = getLabWhitePoint;

input.format.lab = lab2rgb;

input.autodetect.push({
    p: 2,
    test: (...args) => {
        args = unpack(args, 'lab');
        if (type(args) === 'array' && args.length === 3) {
            return 'lab';
        }
    }
});
