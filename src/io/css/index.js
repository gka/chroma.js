const chroma = require('../../chroma');
const Color = require('../../Color');
const input = require('../input');

const rgb2css = require('./rgb2css');

Color.prototype.css = function(mode) {
    return rgb2css(this._rgb, mode);
};

chroma.css = (...args) => new Color(...args, 'css');

input.format.css = require('./css2rgb');


