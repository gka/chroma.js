import { unpack } from '../../utils/index.js';
const { round } = Math;

const rgb2num = (...args) => {
    // channels are stored as floats, so round them like rgb2hex does
    const [r, g, b] = unpack(args, 'rgb').map(round);
    return (r << 16) + (g << 8) + b;
};

export default rgb2num;
