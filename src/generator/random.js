import Color from '../Color.js';
const digits = '0123456789abcdef';

const { floor, random } = Math;

export default () => {
    let code = '#';
    for (let i = 0; i < 6; i++) {
        code += digits.charAt(floor(random() * 16));
    }
    return new Color(code, 'hex');
};
