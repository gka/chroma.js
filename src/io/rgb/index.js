const chroma = require('../../chroma');
const Color = require('../../Color');
const input = require('../input');
const {unpack, type} = require('../../utils');

Color.prototype.rgb = function(...args) {
    if (args.length) {
        this._rgb = unpack(args, 'rgb');
    } else {
        return this._rgb.slice(0,3);
    }
};

Color.prototype.rgba = function(...args) {
    if (args.length) {
        this._rgb = unpack(args, 'rgba');
    } else {
        return this._rgb.slice(0,4);
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
            args.length === 4 && type(args[3]) == 'number' && args[3] >= 0 && args[3] <= 1)) {
            return 'rgb';
        }
    }
});
