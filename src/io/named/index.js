import Color from '../../Color.js';
import input from '../input.js';
import { type } from '../../utils/index.js';

import w3cx11 from '../../colors/w3cx11.js';
import hex2rgb from '../hex/hex2rgb.js';
import rgb2hex from '../hex/rgb2hex.js';

Color.prototype.name = function () {
    const hex = rgb2hex(this._rgb, 'rgb');
    for (let n of Object.keys(w3cx11)) {
        if (w3cx11[n] === hex) return n.toLowerCase();
    }
    return hex;
};

input.format.named = (name) => {
    name = name.toLowerCase();
    if (w3cx11[name]) return hex2rgb(w3cx11[name]);
    throw new Error('unknown color name: ' + name);
};

input.autodetect.push({
    p: 5,
    test: (h, ...rest) => {
        if (!rest.length && type(h) === 'string' && w3cx11[h.toLowerCase()]) {
            return 'named';
        }
    }
});
