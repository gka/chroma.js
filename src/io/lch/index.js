const {unpack, type} = require('../../utils');
const chroma = require('../../chroma');
const Color = require('../../Color');
const input = require('../input');

const rgb2lch = require('./rgb2lch');

Color.prototype.lch = function() {
    return rgb2lch(this._rgb);
};

chroma.lch = (...args) => new Color(...args, 'lch');

input.format.lch = require('./lch2rgb');

input.autodetect.push({
    p: 2,
    test: (...args) => {
        args = unpack(args, 'lch');
        if (type(args) === 'array' && args.length === 3) {
            return 'lch';
        }
    }
});
