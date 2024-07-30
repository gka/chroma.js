import '../io/lch/index.js';
import Color from '../Color.js';
import LAB_CONSTANTS from '../io/lab/lab-constants.js';

Color.prototype.saturate = function (amount = 1) {
    const me = this;
    const lch = me.lch();
    lch[1] += LAB_CONSTANTS.Kn * amount;
    if (lch[1] < 0) lch[1] = 0;
    return new Color(lch, 'lch').alpha(me.alpha(), true);
};

Color.prototype.desaturate = function (amount = 1) {
    return this.saturate(-amount);
};
