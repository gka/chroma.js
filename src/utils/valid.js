import Color from '../Color.js';

export default (...args) => {
    try {
        new Color(...args);
        return true;
        // eslint-disable-next-line
    } catch (e) {
        return false;
    }
};
