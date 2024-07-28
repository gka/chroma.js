import { unpack, type } from '../../utils/index.js';
import chroma from '../../chroma.js';
import Color from '../../Color.js';
import input from '../input.js';
import hcg2rgb from './hcg2rgb.js';
import rgb2hcg from './rgb2hcg.js';

Color.prototype.hcg = function () {
    return rgb2hcg(this._rgb);
};

chroma.hcg = (...args) => new Color(...args, 'hcg');

input.format.hcg = hcg2rgb;

input.autodetect.push({
    p: 1,
    test: (...args) => {
        args = unpack(args, 'hcg');
        if (type(args) === 'array' && args.length === 3) {
            return 'hcg';
        }
    }
});
