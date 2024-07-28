import { unpack } from '../../utils/index.js';
import lch2rgb from './lch2rgb.js';

const hcl2rgb = (...args) => {
    const hcl = unpack(args, 'hcl').reverse();
    return lch2rgb(...hcl);
};

export default hcl2rgb;
