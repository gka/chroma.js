import { unpack, RAD2DEG } from '../../utils/index.js';
const { sqrt, atan2, round } = Math;

const lab2lch = (...args) => {
    const [l, a, b] = unpack(args, 'lab');
    const c = sqrt(a * a + b * b);
    let h = (atan2(b, a) * RAD2DEG + 360) % 360;
    if (round(c * 10000) === 0) h = Number.NaN;
    return [l, c, h];
};

export default lab2lch;
