import Color from './Color.js';
import { version } from './version.js';

const chroma = (...args) => {
    return new chroma.Color(...args);
};

chroma.Color = Color;
chroma.version = version;

export default chroma;
