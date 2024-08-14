import { unpack } from '../../utils/index.js';
const rnd = (a) => Math.round(a * 100) / 100;

const oklab2css = (...args) => {
    const laba = unpack(args, 'lab');
    laba[0] = rnd(laba[0] * 100) + '%';
    laba[1] = rnd(laba[1]);
    laba[2] = rnd(laba[2]);
    if (laba.length > 3 && laba[3] < 1) {
        laba[3] = '/ ' + (laba.length > 3 ? laba[3] : 1);
    } else {
        laba.length = 3;
    }
    return `oklab(${laba.join(' ')})`;
};

export default oklab2css;
