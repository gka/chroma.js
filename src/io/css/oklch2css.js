import { unpack, rnd2, rnd3 } from '../../utils/index.js';

const oklch2css = (...args) => {
    const lcha = unpack(args, 'lch');
    lcha[0] = rnd2(lcha[0] * 100) + '%';
    lcha[1] = rnd3(lcha[1]);
    lcha[2] = isNaN(lcha[2]) ? 'none' : rnd2(lcha[2]) + 'deg'; // add deg unit to hue
    if (lcha.length > 3 && lcha[3] < 1) {
        lcha[3] = '/ ' + (lcha.length > 3 ? lcha[3] : 1);
    } else {
        lcha.length = 3;
    }
    return `oklch(${lcha.join(' ')})`;
};

export default oklch2css;
