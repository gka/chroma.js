import Color from './Color.js';

const chroma = (...args) => {
    return new chroma.Color(...args);
};

chroma.Color = Color;
chroma.version = '@@version';

export default chroma;
