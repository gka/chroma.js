/*
 * Based on implementation by Neil Bartlett
 * https://github.com/neilbartlett/color-temperature
 **/

const temperature2rgb = require('./temperature2rgb');
const {unpack} = require('../../utils');
const {round} = Math;

const rgb2temperature = (...args) => {
    const [r,g,b] = unpack(args, 'rgb');
    let minTemp = 1000;
    let maxTemp = 40000;
    const eps = 0.4;
    let temp;
    while (maxTemp - minTemp > eps) {
        temp = (maxTemp + minTemp) * 0.5;
        const rgb = temperature2rgb(temp);
        if ((rgb[2] / rgb[0]) >= (b / r)) {
            maxTemp = temp;
        } else {
            minTemp = temp;
        }
    }
    return round(temp);
}

module.exports = rgb2temperature;
