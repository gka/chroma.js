const {unpack, last} = require('../../utils');
const hsl2css = require('../misc/hsl2css');
const rgb2hsl = require('./rgb2hsl');
const {round} = Math;

const rgb2css = (...args) => {
    const rgba = unpack(args, 'rgba');
    let mode = last(args) || 'rgb';
    if (mode.substr(0,3) == 'hsl') {
        return hsl2css(rgb2hsl(rgba), mode);
    }
    rgba[0] = round(rgba[0]);
    rgba[1] = round(rgba[1]);
    rgba[2] = round(rgba[2]);
    if (mode === 'rgba' || (rgba.length > 3 && rgba[3]<1)) {
        rgba[3] = rgba.length > 3 ? rgba[3] : 1;
        mode = 'rgba';
    }
    return `${mode}(${rgba.join(',')})`;
}

module.exports = rgb2css;
