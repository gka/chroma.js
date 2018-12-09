const chroma = require('./src/chroma');

// feel free to comment out anything to rollup
// a smaller chroma.js built

// io --> convert colors
require('./src/io/cmyk');
require('./src/io/css');
require('./src/io/gl');
require('./src/io/hcg');
require('./src/io/hex');
require('./src/io/hsi');
require('./src/io/hsl');
require('./src/io/hsv');
require('./src/io/lab');
require('./src/io/lch');
require('./src/io/named');
require('./src/io/num');
require('./src/io/rgb');
require('./src/io/temp');

// operators --> modify existing Colors
require('./src/ops/alpha');

// generators -- > create new colors
chroma.blend = require('./src/generator/blend');
chroma.random = require('./src/generator/random');

module.exports = chroma;
