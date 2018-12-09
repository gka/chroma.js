const chroma = require('../../chroma');
const Color = require('../../Color');
const input = require('../input');
const {unpack, type} = require('../../utils');

Color.prototype.rgb = function(...args) {
    if (args.length) {
        this._rgb = unpack(args, 'rgba');
    } else {
        return this._rgb.slice(0);
    }
};

chroma.rgb = (...args) => new Color(...args, 'rgb');

input.format.rgb = (...args) => {
    return unpack(args, 'rgba');
};

input.autodetect.push({
    p: 3,
    test: (...args) => {
        args = unpack(args, 'rgba');
        if (type(args) === 'array' && (args.length === 3 ||
            args.length === 4 && type(a[3]) == 'number' && a[3] >= 0 && a[3] <= 1)) {
            return 'rgb';
        }
    }
});
