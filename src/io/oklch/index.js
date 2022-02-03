const { unpack, type } = require('../../utils');
const chroma = require('../../chroma');
const Color = require('../../Color');
const input = require('../input');

const rgb2oklch = require('./rgb2oklch');

Color.prototype.oklch = function () {
    return rgb2oklch(this._rgb);
};

chroma.oklch = (...args) => new Color(...args, 'oklch');

input.format.oklch = require('./oklch2rgb');

input.autodetect.push({
    p: 3,
    test: (...args) => {
        args = unpack(args, 'oklch');
        if (type(args) === 'array' && args.length === 3) {
            return 'oklch';
        }
    }
});
