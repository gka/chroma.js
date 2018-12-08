const {unpack} = require('../../utils');

const rgb2hsl = (...args) => {
    args = unpack(args, 'rgba');
    let [r,g,b] = args;

    r /= 255;
    g /= 255;
    b /= 255;

    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);

    const l = (max + min) / 2;
    let s, h;

    if (max === min){
        s = 0;
        h = Number.NaN;
    } else {
        s = l < 0.5 ? (max - min) / (max + min) : (max - min) / (2 - max - min);
    }

    if (r == max) h = (g - b) / (max - min);
    else if (g == max) h = 2 + (b - r) / (max - min);
    else if (b == max) h = 4 + (r - g) / (max - min);

    h *= 60;
    if (h < 0) h += 360;
    return [h,s,l,args.length>3?args[3]:1];
}

module.exports = rgb2hsl;
