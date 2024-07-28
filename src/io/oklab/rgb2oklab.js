import { unpack } from '../../utils/index.js';
const { cbrt, pow, sign } = Math;

const rgb2oklab = (...args) => {
    // OKLab color space implementation taken from
    // https://bottosson.github.io/posts/oklab/
    const [r, g, b] = unpack(args, 'rgb');
    const [lr, lg, lb] = [
        rgb2lrgb(r / 255),
        rgb2lrgb(g / 255),
        rgb2lrgb(b / 255)
    ];
    const l = cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
    const m = cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
    const s = cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

    return [
        0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
        1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
        0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
    ];
};

export default rgb2oklab;

function rgb2lrgb(c) {
    const abs = Math.abs(c);
    if (abs < 0.04045) {
        return c / 12.92;
    }
    return (sign(c) || 1) * pow((abs + 0.055) / 1.055, 2.4);
}
