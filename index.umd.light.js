import chroma from './src/chroma.js';

// feel free to comment out anything to rollup
// a smaller chroma.js bundle

// io --> convert colors
import { css } from './src/io/css/index.js';
import { hex } from './src/io/hex/index.js';
import { hsl } from './src/io/hsl/index.js';
import { lab } from './src/io/lab/index.js';
import { oklab } from './src/io/oklab/index.js';
import { rgb } from './src/io/rgb/index.js';

// operators --> modify existing Colors
import './src/ops/alpha.js';
import './src/ops/darken.js';
import './src/ops/get.js';
import './src/ops/mix.js';
import './src/ops/set.js';
import './src/ops/shade.js';

// interpolators
import './src/interpolator/lrgb.js';
import './src/interpolator/oklab.js';

// generators -- > create new colors
import mix from './src/generator/mix.js';

// other utility methods
import valid from './src/utils/valid.js';
import Color from './src/Color.js';

Object.assign(chroma, {
    Color,
    valid,
    css,
    hex,
    hsl,
    lab,
    oklab,
    rgb,
    mix,
    interpolate: mix
});

export default chroma;
