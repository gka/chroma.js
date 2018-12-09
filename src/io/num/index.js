const chroma = require('../../chroma');
const Color = require('../../Color');
const input = require('../input');

const rgb2num = require('./rgb2num');

Color.prototype.num = function() {
    return rgb2num(this._rgb);
};

chroma.num = (...args) => new Color(...args, 'num');

input.format.num = require('./num2rgb');


