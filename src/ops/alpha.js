import Color from '../Color.js';
import { type } from '../utils/index.js';

Color.prototype.alpha = function (a, mutate = false) {
    if (a !== undefined && type(a) === 'number') {
        if (mutate) {
            this._rgb[3] = a;
            return this;
        }
        return new Color([this._rgb[0], this._rgb[1], this._rgb[2], a], 'rgb');
    }
    return this._rgb[3];
};
