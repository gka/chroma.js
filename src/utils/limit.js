import { min, max } from './index.js';

export default (x, low = 0, high = 1) => {
    return min(max(low, x), high);
};
