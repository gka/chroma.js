/*
 * Based on implementation by Neil Bartlett
 * https://github.com/neilbartlett/color-temperature
 **/

import temperature2rgb from './temperature2rgb.js';
import { unpack } from '../../utils/index.js';
const { round } = Math;

const rgb2temperature = (...args) => {
    const rgb = unpack(args, 'rgb');
    const r = rgb[0],
        g = rgb[1],
        b = rgb[2];
    const targetRatio = b === 0 ? g / r : b / r;
    let minTemp = 1000;
    let maxTemp = 40000;
    const eps = 0.4;
    let temp;
    while (maxTemp - minTemp > eps) {
        temp = (maxTemp + minTemp) * 0.5;
        const rgb = temperature2rgb(temp);
        const ratio = b === 0 ? rgb[1] / rgb[0] : rgb[2] / rgb[0];
        if (ratio >= targetRatio) {
            maxTemp = temp;
        } else {
            minTemp = temp;
        }
    }
    return round(temp);
};

export default rgb2temperature;
