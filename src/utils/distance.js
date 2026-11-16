import Color from '../Color.js';

// simple Euclidean distance
export default function (a, b, mode = 'lab') {
    // Delta E (CIE 1976)
    // see http://www.brucelindbloom.com/index.html?Equations.html
    a = new Color(a);
    b = new Color(b);
    const l1 = a.get(mode);
    const l2 = b.get(mode);
    // channel letters, with oklch's hue at index 2
    const channels = mode.replace(/^ok/, '');
    let sum_sq = 0;
    for (let i in l1) {
        let d = (l1[i] || 0) - (l2[i] || 0);
        if (channels.charAt(i) === 'h') {
            // hue is an angle: take the short way around the color wheel
            d = Math.abs(d) % 360;
            if (d > 180) d = 360 - d;
        }
        sum_sq += d * d;
    }
    return Math.sqrt(sum_sq);
}
