import chroma from '../../chroma.js';
import Color from '../../Color.js';
import input from '../input.js';
import { unpack, type } from '../../utils/index.js';
const { round } = Math;

Color.prototype.rgb = function (rnd = true) {
    if (rnd === false) return this._rgb.slice(0, 3);
    return this._rgb.slice(0, 3).map(round);
};

Color.prototype.rgba = function (rnd = true) {
    return this._rgb.slice(0, 4).map((v, i) => {
        return i < 3 ? (rnd === false ? v : round(v)) : v;
    });
};

const rgb = (...args) => new Color(...args, 'rgb');
Object.assign(chroma, { rgb });

const isValidChannel = (value) =>
    type(value) === 'number' && !Number.isNaN(value);

input.format.rgb = (...args) => {
    const rgba = unpack(args, 'rgba');
    if (!rgba.slice(0, 3).every(isValidChannel)) {
        throw new Error('invalid rgb color');
    }
    if (rgba[3] !== undefined && !isValidChannel(rgba[3])) {
        throw new Error('invalid rgb color');
    }
    if (rgba[3] === undefined) rgba[3] = 1;
    return rgba;
};

input.autodetect.push({
    p: 3,
    test: (...args) => {
        args = unpack(args, 'rgba');
        if (
            type(args) === 'array' &&
            args.slice(0, 3).every(isValidChannel) &&
            (args.length === 3 ||
                (args.length === 4 &&
                    type(args[3]) == 'number' &&
                    args[3] >= 0 &&
                    args[3] <= 1))
        ) {
            return 'rgb';
        }
    }
});

export { rgb };
