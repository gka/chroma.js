/*
 * interpolates between a set of colors uzing a bezier spline
 * blend mode formulas taken from https://web.archive.org/web/20180110014946/http://www.venture-ware.com/kevin/coding/lets-learn-math-photoshop-blend-modes/
 */

import '../io/rgb/index.js';
import chroma from '../chroma.js';
import limit from '../utils/limit.js';

const blend = (bottom, top, mode) => {
    if (!blend[mode]) {
        throw new Error('unknown blend mode ' + mode);
    }
    return blend[mode](bottom, top);
};

const blend_f = (f) => (bottom, top) => {
    const c0 = chroma(top).rgba();
    const c1 = chroma(bottom).rgba();
    c0[3] = limit(c0[3], 0, 1);
    c1[3] = limit(c1[3], 0, 1);
    const alpha = c0[3] + c1[3] * (1 - c0[3]);
    if (alpha === 0) return chroma.rgb(0, 0, 0, 0);
    if (c0[3] === 0) return chroma.rgb(c1);
    if (c1[3] === 0) return chroma.rgb(c0);

    const out = f(c0, c1);
    if (c0[3] === 1 && c1[3] === 1) return chroma.rgb(out);

    // Source-over composition: blend only where source and backdrop overlap.
    for (let i = 0; i < 3; i++) {
        out[i] =
            (c0[3] * (1 - c1[3]) * c0[i] +
                c0[3] * c1[3] * limit(out[i], 0, 255) +
                (1 - c0[3]) * c1[3] * c1[i]) /
            alpha;
    }
    return chroma.rgb(...out, alpha);
};

const each = (f) => (c0, c1) => {
    const out = [];
    out[0] = f(c0[0], c1[0]);
    out[1] = f(c0[1], c1[1]);
    out[2] = f(c0[2], c1[2]);
    return out;
};

const normal = (a) => a;
const multiply = (a, b) => (a * b) / 255;
const darken = (a, b) => (a > b ? b : a);
const lighten = (a, b) => (a > b ? a : b);
const screen = (a, b) => 255 * (1 - (1 - a / 255) * (1 - b / 255));
const overlay = (a, b) =>
    b < 128 ? (2 * a * b) / 255 : 255 * (1 - 2 * (1 - a / 255) * (1 - b / 255));
const burn = (a, b) =>
    b === 255 ? 255 : 255 * (1 - (1 - b / 255) / (a / 255));
const dodge = (a, b) => {
    if (a === 255) return 255;
    a = (255 * (b / 255)) / (1 - a / 255);
    return a > 255 ? 255 : a;
};

// # add = (a,b) ->
// #     if (a + b > 255) then 255 else a + b

blend.normal = blend_f(each(normal));
blend.multiply = blend_f(each(multiply));
blend.screen = blend_f(each(screen));
blend.overlay = blend_f(each(overlay));
blend.darken = blend_f(each(darken));
blend.lighten = blend_f(each(lighten));
blend.dodge = blend_f(each(dodge));
blend.burn = blend_f(each(burn));
// blend.add = blend_f(each(add));

export default blend;
