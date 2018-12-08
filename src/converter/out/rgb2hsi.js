const {unpack,TWOPI} = require('../../utils');
const {min,sqrt,acos} = Math;

const rgb2hsi = (...args) => {
    /*
    borrowed from here:
    http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/rgb2hsi.cpp
    */
    let [r,g,b] = unpack(args, 'rgb');
    r /= 255;
    g /= 255;
    b /= 255;
    let h;
    const min_ = min(r,g,b);
    const i = (r+g+b) / 3;
    const s = 1 - min_/i;
    if (s === 0) {
        h = 0
    } else {
        h = ((r-g)+(r-b)) / 2;
        h /= sqrt((r-g)*(r-g) + (r-b)*(g-b));
        h = acos(h);
        if (b > g) {
            h = TWOPI - h;
        }
        h /= TWOPI;
    }
    return [h*360,s,i];
}

module.exports = rgb2hsi;

