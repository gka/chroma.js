import { unpack, last, rnd2 } from '../../utils/index.js';

/*
 * supported arguments:
 * - hsl2css(h,s,l)
 * - hsl2css(h,s,l,a)
 * - hsl2css([h,s,l], mode)
 * - hsl2css([h,s,l,a], mode)
 * - hsl2css({h,s,l,a}, mode)
 */
const hsl2css = (...args) => {
    const hsla = unpack(args, 'hsla');
    let mode = last(args) || 'lsa';
    hsla[0] = rnd2(hsla[0] || 0) + 'deg';
    hsla[1] = rnd2(hsla[1] * 100) + '%';
    hsla[2] = rnd2(hsla[2] * 100) + '%';
    if (mode === 'hsla' || (hsla.length > 3 && hsla[3] < 1)) {
        hsla[3] = '/ ' + (hsla.length > 3 ? hsla[3] : 1);
        mode = 'hsla';
    } else {
        hsla.length = 3;
    }
    return `${mode.substr(0, 3)}(${hsla.join(' ')})`;
};

export default hsl2css;
