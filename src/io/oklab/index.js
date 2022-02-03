const { unpack, type } = require('../../utils');
const chroma = require('../../chroma');
const Color = require('../../Color');
const input = require('../input');

const rgb2oklab = require('./rgb2oklab');

Color.prototype.oklab = function () {
    return rgb2oklab(this._rgb);
};

chroma.oklab = (...args) => new Color(...args, 'oklab');

input.format.oklab = require('./oklab2rgb');

input.autodetect.push({
    p: 3,
    test: (...args) => {
        args = unpack(args, 'oklab');
        if (type(args) === 'array' && args.length === 3) {
            return 'oklab';
        }
    }
});
