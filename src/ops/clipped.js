import Color from '../Color.js';

Color.prototype.clipped = function () {
    return this._rgb._clipped || false;
};
