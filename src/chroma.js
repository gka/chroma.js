import Color from './Color.js';
import { version } from './version.js';

const chroma = (...args) => {
    return new Color(...args);
};

chroma.version = version;

export default chroma;
