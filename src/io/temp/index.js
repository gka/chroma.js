import chroma from '../../chroma.js';
import Color from '../../Color.js';
import input from '../input.js';
import temperature2rgb from './temperature2rgb.js';
import rgb2temperature from './rgb2temperature.js';

Color.prototype.temp =
    Color.prototype.kelvin =
    Color.prototype.temperature =
        function () {
            return rgb2temperature(this._rgb);
        };

chroma.temp =
    chroma.kelvin =
    chroma.temperature =
        (...args) => new Color(...args, 'temp');

input.format.temp =
    input.format.kelvin =
    input.format.temperature =
        temperature2rgb;
