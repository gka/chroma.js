import Color from '../Color.js';
import mix from '../generator/mix.js';

Color.prototype.mix = Color.prototype.interpolate = function (
    col2,
    f = 0.5,
    ...rest
) {
    return mix(this, col2, f, ...rest);
};
