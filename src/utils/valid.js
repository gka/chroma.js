import Color from '../Color.js';

export default (...args) => {
    try {
        new Color(...args);
        return true;
    } catch (e) {
        return false;
    }
};
