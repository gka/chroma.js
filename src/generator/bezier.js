//
// interpolates between a set of colors uzing a bezier spline
//

// @requires utils lab
const Color = require('../Color');
require('../io/lab');
const scale = require('./scale');

const bezier = function(colors) {
    let I, lab0, lab1, lab2;
    colors = colors.map(c => new Color(c));
    if (colors.length === 2) {
        // linear interpolation
        [lab0, lab1] = colors.map(c => c.lab());
        I = function(t) {
            const linearInterpolation = (x0, x1) => x0 + (t * (x1 - x0));
            const lab = ([0, 1, 2].map((i) => linearInterpolation(lab0[i], lab1[i])));
            const alpha = linearInterpolation(colors[0].alpha(), colors[1].alpha());
            return new Color(lab, 'lab').alpha(alpha);
        };
    } else if (colors.length === 3) {
        // quadratic bezier interpolation
        [lab0, lab1, lab2] = colors.map(c => c.lab());
        I = function(t) {
            const quadraticInterpolation = (x0, x1, x2) => ((1-t)*(1-t) * x0) + (2 * (1-t) * t * x1) + (t * t * x2)
            const lab = ([0, 1, 2].map((i) => quadraticInterpolation(lab0[i], lab1[i], lab2[i])));
            const alpha = quadraticInterpolation(colors[0].alpha(), colors[1].alpha(), colors[2].alpha());
            return new Color(lab, 'lab').alpha( alpha );
        };
    } else if (colors.length === 4) {
        // cubic bezier interpolation
        let lab3;
        [lab0, lab1, lab2, lab3] = colors.map(c => c.lab());
        I = function(t) {
            const cubicInterpolation = (x0, x1, x2, x3) => ((1-t)*(1-t)*(1-t) * x0) + (3 * (1-t) * (1-t) * t * x1) + (3 * (1-t) * t * t * x2) + (t*t*t * x3);
            const lab = ([0, 1, 2].map((i) => cubicInterpolation(lab0[i], lab1[i], lab2[i], lab3[i])));
            const alpha = cubicInterpolation(colors[0].alpha(), colors[1].alpha(), colors[2].alpha(), colors[3].alpha());
            return new Color(lab, 'lab').alpha(alpha);
        };
    } else if (colors.length === 5) {
        const I0 = bezier(colors.slice(0, 3));
        const I1 = bezier(colors.slice(2, 5));
        I = function(t) {
            if (t < 0.5) {
                return I0(t*2);
            } else {
                return I1((t-0.5)*2);
            }
        };
    }
    return I;
};

module.exports = (colors) => {
    const f = bezier(colors);
    f.scale = () => scale(f);
    return f;
}
