const chroma = require('../../chroma');
const Color = require('../../Color');
const input = require('../input');
const rgb2hex = require('./rgb2hex');

Color.prototype.hex = function(mode) {
    return rgb2hex(this._rgb, mode);
};

input.hex = require('./hex2rgb');
chroma.hex = (...args) => new Color(...args, 'hex');
