const Color = require('../Color');
const {type} = require('../utils');

Color.prototype.alpha = function(a) {
    if (a !== undefined && type(a) === 'number') {
        return new Color([this._rgb[0], this._rgb[1], this._rgb[2], a], 'rgb');
    }
    return this._rgb[3];
}
