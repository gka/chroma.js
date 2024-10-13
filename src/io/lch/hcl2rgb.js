import { unpack, reverse3 } from '../../utils/index.js';
import lch2rgb from './lch2rgb.js';

const hcl2rgb = (...args) => {
    const hcl = reverse3(unpack(args, 'hcl'));
    return lch2rgb(...hcl);
};

export default hcl2rgb;
