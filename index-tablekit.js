const chroma = require('./src/chroma');

// this file has been optimised to provide just the chroma features required
// for TableCheck's TableKit component library

// io --> convert colors
require('./src/io/css');
require('./src/io/hex');
require('./src/io/rgb');
require('./src/io/lab');

// operators --> modify existing Colors
require('./src/ops/alpha');
require('./src/ops/darken');
require('./src/ops/saturate');
require('./src/ops/luminance');
require('./src/ops/get');
require('./src/ops/mix');
require('./src/ops/set');

// interpolators
require('./src/interpolator/lrgb');

// generators -- > create new colors
chroma.mix = chroma.interpolate = require('./src/generator/mix');

// other utility methods
chroma.valid = require('./src/utils/valid');

module.exports = chroma;
