// feel free to comment out anything to rollup
// a smaller chroma.js bundle
import chroma from './src/chroma.js';

// io --> convert colors
import './src/io/named/index.js';

// operators --> modify existing Colors
import './src/ops/alpha.js';
import './src/ops/clipped.js';
import './src/ops/darken.js';
import './src/ops/get.js';
import './src/ops/luminance.js';
import './src/ops/mix.js';
import './src/ops/premultiply.js';
import './src/ops/saturate.js';
import './src/ops/set.js';
import './src/ops/shade.js';

// interpolators
import './src/interpolator/rgb.js';
import './src/interpolator/lrgb.js';
import './src/interpolator/lab.js';
import './src/interpolator/lch.js';
import './src/interpolator/num.js';
import './src/interpolator/hcg.js';
import './src/interpolator/hsi.js';
import './src/interpolator/hsl.js';
import './src/interpolator/hsv.js';
import './src/interpolator/oklab.js';
import './src/interpolator/oklch.js';

// generators -- > create new colors
import average from './src/generator/average.js';
import bezier from './src/generator/bezier.js';
import blend from './src/generator/blend.js';
import cubehelix from './src/generator/cubehelix.js';
import mix from './src/generator/mix.js';
import random from './src/generator/random.js';
import scale from './src/generator/scale.js';

// other utility methods
import { analyze } from './src/utils/analyze.js';
import contrast from './src/utils/contrast.js';
import contrastAPCA from './src/utils/contrastAPCA.js';
import deltaE from './src/utils/delta-e.js';
import distance from './src/utils/distance.js';
import { limits } from './src/utils/analyze.js';
import valid from './src/utils/valid.js';
import input from './src/io/input.js';

// scale
import scales from './src/utils/scales.js';

// colors
import colors from './src/colors/w3cx11.js';
import brewer from './src/colors/colorbrewer.js';
import Color from './src/Color.js';

Object.assign(chroma, {
    analyze,
    average,
    bezier,
    blend,
    brewer,
    Color,
    colors,
    contrast,
    contrastAPCA,
    cubehelix,
    deltaE,
    distance,
    input,
    interpolate: mix,
    limits,
    mix,
    random,
    scale,
    scales,
    valid
});

export default chroma;

export {
    analyze,
    average,
    bezier,
    blend,
    brewer,
    Color,
    colors,
    contrast,
    contrastAPCA,
    cubehelix,
    deltaE,
    distance,
    input,
    limits,
    mix,
    mix as interpolate,
    random,
    scale,
    scales,
    valid
};

export * from './src/io/cmyk/index.js';
export * from './src/io/css/index.js';
export * from './src/io/gl/index.js';
export * from './src/io/hcg/index.js';
export * from './src/io/hex/index.js';
export * from './src/io/hsi/index.js';
export * from './src/io/hsl/index.js';
export * from './src/io/hsv/index.js';
export * from './src/io/lab/index.js';
export * from './src/io/lch/index.js';
export * from './src/io/num/index.js';
export * from './src/io/rgb/index.js';
export * from './src/io/temp/index.js';
export * from './src/io/oklab/index.js';
export * from './src/io/oklch/index.js';
