import '../io/lab/index.js';
import Color from '../Color.js';
import mix from '../generator/mix.js';

Color.prototype.tint = function (f = 0.5, ...rest) {
    return mix(this, 'white', f, ...rest);
};

Color.prototype.shade = function (f = 0.5, ...rest) {
    return mix(this, 'black', f, ...rest);
};
