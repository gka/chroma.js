import hsl2rgb from '../hsl/hsl2rgb.js';
import lab2rgb from '../lab/lab2rgb.js';
import lch2rgb from '../lch/lch2rgb.js';
import oklab2rgb from '../oklab/oklab2rgb.js';
import oklch2rgb from '../oklch/oklch2rgb.js';
import input from '../input.js';
import limit from '../../utils/limit.js';
import { getLabWhitePoint, setLabWhitePoint } from '../lab/lab-constants.js';

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

const RE_LAB =
    /^lab\(\s*(-?\d+(?:\.\d+)?%?) \s*(-?\d+(?:\.\d+)?%?) \s*(-?\d+(?:\.\d+)?%?)\s*(?:\/\s*(\d+(?:\.\d+)?))?\)?$/;
const RE_LCH =
    /^lch\(\s*(-?\d+(?:\.\d+)?%?) \s*((?:-?\d+(?:\.\d+)?%?)|none) \s*(-?\d+(?:\.\d+)?(?:deg)?|none)\s*(?:\/\s*(\d+(?:\.\d+)?))?\)?$/;
const RE_OKLAB =
    /^oklab\(\s*(-?\d+(?:\.\d+)?%?) \s*(-?\d+(?:\.\d+)?%?) \s*(-?\d+(?:\.\d+)?%?)\s*(?:\/\s*(\d+(?:\.\d+)?))?\)?$/;
const RE_OKLCH =
    /^oklch\(\s*(-?\d+(?:\.\d+)?%?) \s*(?:(-?\d+(?:\.\d+)?%?)|none) \s*(-?\d+(?:\.\d+)?(?:deg)?|none)\s*(?:\/\s*(\d+(?:\.\d+)?))?\)?$/;

const { round } = Math;

const roundRGB = (rgb) => {
    return rgb.map((v, i) => (i <= 2 ? limit(round(v), 0, 255) : v));
};

const percentToAbsolute = (pct, min = 0, max = 100, signed = false) => {
    if (typeof pct === 'string' && pct.endsWith('%')) {
        pct = parseFloat(pct.substring(0, pct.length - 1)) / 100;
        if (signed) {
            // signed percentages are in the range -100% to 100%
            pct = min + (pct + 1) * 0.5 * (max - min);
        } else {
            pct = min + pct * (max - min);
        }
    }
    return +pct;
};

const noneToValue = (v, noneValue) => {
    return v === 'none' ? noneValue : v;
};

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

    if ((m = css.match(RE_LAB))) {
        const lab = m.slice(1, 4);
        lab[0] = percentToAbsolute(lab[0], 0, 100);
        lab[1] = percentToAbsolute(lab[1], -125, 125, true);
        lab[2] = percentToAbsolute(lab[2], -125, 125, true);
        // convert to D50 Lab whitepoint
        const wp = getLabWhitePoint();
        setLabWhitePoint('d50');
        const rgb = roundRGB(lab2rgb(lab));
        // convert back to original Lab whitepoint
        setLabWhitePoint(wp);
        rgb[3] = m[4] !== undefined ? +m[4] : 1;
        return rgb;
    }

    if ((m = css.match(RE_LCH))) {
        const lch = m.slice(1, 4);
        lch[0] = percentToAbsolute(lch[0], 0, 100);
        lch[1] = percentToAbsolute(noneToValue(lch[1], 0), 0, 150, false);
        lch[2] = +noneToValue(lch[2].replace('deg', ''), 0);
        // convert to D50 Lab whitepoint
        const wp = getLabWhitePoint();
        setLabWhitePoint('d50');
        const rgb = roundRGB(lch2rgb(lch));
        // convert back to original Lab whitepoint
        setLabWhitePoint(wp);
        rgb[3] = m[4] !== undefined ? +m[4] : 1;
        return rgb;
    }

    if ((m = css.match(RE_OKLAB))) {
        const oklab = m.slice(1, 4);
        oklab[0] = percentToAbsolute(oklab[0], 0, 1);
        oklab[1] = percentToAbsolute(oklab[1], -0.4, 0.4, true);
        oklab[2] = percentToAbsolute(oklab[2], -0.4, 0.4, true);
        const rgb = roundRGB(oklab2rgb(oklab));
        rgb[3] = m[4] !== undefined ? +m[4] : 1;
        return rgb;
    }

    if ((m = css.match(RE_OKLCH))) {
        const oklch = m.slice(1, 4);
        oklch[0] = percentToAbsolute(oklch[0], 0, 1);
        oklch[1] = percentToAbsolute(noneToValue(oklch[1], 0), 0, 0.4, false);
        oklch[2] = +noneToValue(oklch[2].replace('deg', ''), 0);
        const rgb = roundRGB(oklch2rgb(oklch));
        rgb[3] = m[4] !== undefined ? +m[4] : 1;
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
        RE_LAB.test(s) ||
        RE_LCH.test(s) ||
        RE_OKLAB.test(s) ||
        RE_OKLCH.test(s) ||
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
