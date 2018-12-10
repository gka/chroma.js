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
require('./src/ops/clipped');
require('./src/ops/darken');
require('./src/ops/get');
require('./src/ops/premultiply');
require('./src/ops/saturate');
require('./src/ops/set');
require('./src/ops/luminance');

// interpolators
require('./src/interpolator/rgb');
require('./src/interpolator/lrgb');
require('./src/interpolator/lab');
require('./src/interpolator/lch');
require('./src/interpolator/num');
require('./src/interpolator/hcg');
require('./src/interpolator/hsi');
require('./src/interpolator/hsl');
require('./src/interpolator/hsv');

// generators -- > create new colors
chroma.average = require('./src/generator/average');
chroma.blend = require('./src/generator/blend');
chroma.mix = chroma.interpolate = require('./src/generator/mix');
chroma.random = require('./src/generator/random');

// other utility methods
chroma.contrast = require('./src/utils/contrast');
chroma.analyze = require('./src/utils/analyze').analyze;
chroma.limits = require('./src/utils/analyze').limits;

// colors
chroma.colors = require('./src/colors/w3cx11');
chroma.brewer = require('./src/colors/colorbrewer');

module.exports = chroma;
