const Color = require('../Color');

Color.prototype.clipped = function() {
    return this._rgb.clipped || false;
}
