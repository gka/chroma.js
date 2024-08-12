import { unpack, last } from '../../utils/index.js';
import hsl2css from './hsl2css.js';
import rgb2hsl from '../hsl/rgb2hsl.js';
import lab2css from './lab2css.js';
import rgb2lab from '../lab/rgb2lab.js';
import lch2css from './lch2css.js';
import rgb2lch from '../lch/rgb2lch.js';
import { getLabWhitePoint, setLabWhitePoint } from '../lab/lab-constants.js';
const { round } = Math;

/*
 * supported arguments:
 * - rgb2css(r,g,b)
 * - rgb2css(r,g,b,a)
 * - rgb2css([r,g,b], mode)
 * - rgb2css([r,g,b,a], mode)
 * - rgb2css({r,g,b,a}, mode)
 */
const rgb2css = (...args) => {
    const rgba = unpack(args, 'rgba');
    let mode = last(args) || 'rgb';
    if (mode.substr(0, 3) == 'hsl') {
        return hsl2css(rgb2hsl(rgba), mode);
    }
    if (mode.substr(0, 3) == 'lab') {
        // change to D50 lab whitepoint since this is what W3C is using for CSS Lab colors
        const prevWhitePoint = getLabWhitePoint();
        setLabWhitePoint('d50');
        const cssColor = lab2css(rgb2lab(rgba), mode);
        setLabWhitePoint(prevWhitePoint);
        return cssColor;
    }
    if (mode.substr(0, 3) == 'lch') {
        // change to D50 lab whitepoint since this is what W3C is using for CSS Lab colors
        const prevWhitePoint = getLabWhitePoint();
        setLabWhitePoint('d50');
        const cssColor = lch2css(rgb2lch(rgba), mode);
        setLabWhitePoint(prevWhitePoint);
        return cssColor;
    }
    rgba[0] = round(rgba[0]);
    rgba[1] = round(rgba[1]);
    rgba[2] = round(rgba[2]);
    if (mode === 'rgba' || (rgba.length > 3 && rgba[3] < 1)) {
        rgba[3] = '/ ' + (rgba.length > 3 ? rgba[3] : 1);
        mode = 'rgba';
    }
    return `${mode.substr(0, 3)}(${rgba.slice(0, mode === 'rgb' ? 3 : 4).join(' ')})`;
};

export default rgb2css;
