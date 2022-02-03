const { unpack } = require('../../utils');
const { pow, sign } = Math;

/*
 * L* [0..100]
 * a [-100..100]
 * b [-100..100]
 */
const oklab2rgb = (...args) => {
    args = unpack(args, 'lab');
    const [L, a, b] = args;

    const l = pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
    const m = pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
    const s = pow(L - 0.0894841775 * a - 1.291485548 * b, 3);

    return [
        255 * lrgb2rgb(+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
        255 * lrgb2rgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
        255 * lrgb2rgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
        args.length > 3 ? args[3] : 1
    ];
};

module.exports = oklab2rgb;

function lrgb2rgb(c) {
    const abs = Math.abs(c);
    if (abs > 0.0031308) {
        return (sign(c) || 1) * (1.055 * pow(abs, 1 / 2.4) - 0.055);
    }
    return c * 12.92;
}
