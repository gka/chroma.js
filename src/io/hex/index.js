const chroma = require('../../chroma');
const Color = require('../../Color');
const {type} = require('../../utils');
const input = require('../input');

const rgb2hex = require('./rgb2hex');

Color.prototype.hex = function(mode) {
    return rgb2hex(this._rgb, mode);
};

chroma.hex = (...args) => new Color(...args, 'hex');

input.format.hex = require('./hex2rgb');
input.autodetect.push({
    p: 4,
    test: (h, ...rest) => {
        if (!rest.length && type(h) === 'string' && [3,4,6,7,8,9].includes(h.length)) {
            return 'hex';
        }
    }
})
