import Color from '../Color.js';
const digits = '0123456789abcdef';

const { floor, random } = Math;

/**
 * Generates a random color.
 * @param {() => number} rng - A random number generator function.
 */
export default (rng = random) => {
    let code = '#';
    for (let i = 0; i < 6; i++) {
        code += digits.charAt(floor(rng() * 16));
    }
    return new Color(code, 'hex');
};
