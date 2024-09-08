import { unpack, last, rnd2 } from '../../utils/index.js';

/*
 * supported arguments:
 * - lab2css(l,a,b)
 * - lab2css(l,a,b,alpha)
 * - lab2css([l,a,b], mode)
 * - lab2css([l,a,b,alpha], mode)
 */
const lch2css = (...args) => {
    const lcha = unpack(args, 'lch');
    let mode = last(args) || 'lab';
    lcha[0] = rnd2(lcha[0]) + '%';
    lcha[1] = rnd2(lcha[1]);
    lcha[2] = isNaN(lcha[2]) ? 'none' : rnd2(lcha[2]) + 'deg'; // add deg unit to hue
    if (mode === 'lcha' || (lcha.length > 3 && lcha[3] < 1)) {
        lcha[3] = '/ ' + (lcha.length > 3 ? lcha[3] : 1);
    } else {
        lcha.length = 3;
    }
    return `lch(${lcha.join(' ')})`;
};

export default lch2css;
