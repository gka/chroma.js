import hsl2rgb from '../hsl/hsl2rgb.js';
import input from '../input.js';

const RE_RGB = /^rgb\(\s*(-?\d+) \s*(-?\d+)\s* \s*(-?\d+)\s*\)$/;
const RE_RGB_LEGACY = /^rgb\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*\)$/;

const RE_RGBA =
    /^rgba?\(\s*(-?\d+) \s*(-?\d+)\s* \s*(-?\d+)\s*\/\s*([01]|[01]?\.\d+)\)$/;
const RE_RGBA_LEGACY =
    /^rgba\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*([01]|[01]?\.\d+)\)$/;

const RE_RGB_PCT =
    /^rgb\(\s*(-?\d+(?:\.\d+)?)% \s*(-?\d+(?:\.\d+)?)%\s* \s*(-?\d+(?:\.\d+)?)%\s*\)$/;
const RE_RGB_PCT_LEGACY =
    /^rgb\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/;

const RE_RGBA_PCT =
    /^rgba?\(\s*(-?\d+(?:\.\d+)?)% \s*(-?\d+(?:\.\d+)?)%\s* \s*(-?\d+(?:\.\d+)?)%\s*\/\s*([01]|[01]?\.\d+)\)$/;
const RE_RGBA_PCT_LEGACY =
    /^rgba\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/;

const RE_HSL =
    /^hsl\(\s*(-?\d+(?:\.\d+)?)deg \s*(-?\d+(?:\.\d+)?)%\s* \s*(-?\d+(?:\.\d+)?)%\s*\)$/;
const RE_HSL_LEGACY =
    /^hsl\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/;

const RE_HSLA =
    /^hsla?\(\s*(-?\d+(?:\.\d+)?)deg \s*(-?\d+(?:\.\d+)?)%\s* \s*(-?\d+(?:\.\d+)?)%\s*\/\s*([01]|[01]?\.\d+)\)$/;
const RE_HSLA_LEGACY =
    /^hsla\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/;

const { round } = Math;

const css2rgb = (css) => {
    css = css.toLowerCase().trim();
    let m;

    if (input.format.named) {
        try {
            return input.format.named(css);
            // eslint-disable-next-line
        } catch (e) {}
    }

    // rgb(250 20 0) or rgb(250,20,0)
    if ((m = css.match(RE_RGB)) || (m = css.match(RE_RGB_LEGACY))) {
        const rgb = m.slice(1, 4);
        for (let i = 0; i < 3; i++) {
            rgb[i] = +rgb[i];
        }
        rgb[3] = 1; // default alpha
        return rgb;
    }

    // rgba(250,20,0,0.4)
    if ((m = css.match(RE_RGBA)) || (m = css.match(RE_RGBA_LEGACY))) {
        const rgb = m.slice(1, 5);
        for (let i = 0; i < 4; i++) {
            rgb[i] = +rgb[i];
        }
        return rgb;
    }

    // rgb(100%,0%,0%)
    if ((m = css.match(RE_RGB_PCT)) || (m = css.match(RE_RGB_PCT_LEGACY))) {
        const rgb = m.slice(1, 4);
        for (let i = 0; i < 3; i++) {
            rgb[i] = round(rgb[i] * 2.55);
        }
        rgb[3] = 1; // default alpha
        return rgb;
    }

    // rgba(100%,0%,0%,0.4)
    if ((m = css.match(RE_RGBA_PCT)) || (m = css.match(RE_RGBA_PCT_LEGACY))) {
        const rgb = m.slice(1, 5);
        for (let i = 0; i < 3; i++) {
            rgb[i] = round(rgb[i] * 2.55);
        }
        rgb[3] = +rgb[3];
        return rgb;
    }

    // hsl(0,100%,50%)
    if ((m = css.match(RE_HSL)) || (m = css.match(RE_HSL_LEGACY))) {
        const hsl = m.slice(1, 4);
        hsl[1] *= 0.01;
        hsl[2] *= 0.01;
        const rgb = hsl2rgb(hsl);
        for (let i = 0; i < 3; i++) {
            rgb[i] = round(rgb[i]);
        }
        rgb[3] = 1;
        return rgb;
    }

    // hsla(0,100%,50%,0.5)
    if ((m = css.match(RE_HSLA)) || (m = css.match(RE_HSLA_LEGACY))) {
        const hsl = m.slice(1, 4);
        hsl[1] *= 0.01;
        hsl[2] *= 0.01;
        const rgb = hsl2rgb(hsl);
        for (let i = 0; i < 3; i++) {
            rgb[i] = round(rgb[i]);
        }
        rgb[3] = +m[4]; // default alpha = 1
        return rgb;
    }
};

css2rgb.test = (s) => {
    return (
        // modern
        RE_RGB.test(s) ||
        RE_RGBA.test(s) ||
        RE_RGB_PCT.test(s) ||
        RE_RGBA_PCT.test(s) ||
        RE_HSL.test(s) ||
        RE_HSLA.test(s) ||
        // legacy
        RE_RGB_LEGACY.test(s) ||
        RE_RGBA_LEGACY.test(s) ||
        RE_RGB_PCT_LEGACY.test(s) ||
        RE_RGBA_PCT_LEGACY.test(s) ||
        RE_HSL_LEGACY.test(s) ||
        RE_HSLA_LEGACY.test(s)
    );
};

export default css2rgb;
