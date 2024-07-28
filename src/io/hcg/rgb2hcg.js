import { unpack, max, min } from '../../utils/index.js';

const rgb2hcg = (...args) => {
    const [r, g, b] = unpack(args, 'rgb');
    const minRgb = min(r, g, b);
    const maxRgb = max(r, g, b);
    const delta = maxRgb - minRgb;
    const c = (delta * 100) / 255;
    const _g = (minRgb / (255 - delta)) * 100;
    let h;
    if (delta === 0) {
        h = Number.NaN;
    } else {
        if (r === maxRgb) h = (g - b) / delta;
        if (g === maxRgb) h = 2 + (b - r) / delta;
        if (b === maxRgb) h = 4 + (r - g) / delta;
        h *= 60;
        if (h < 0) h += 360;
    }
    return [h, c, _g];
};

export default rgb2hcg;
