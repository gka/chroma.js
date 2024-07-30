import '../io/lab/index.js';
import Color from '../Color.js';
import LAB_CONSTANTS from '../io/lab/lab-constants.js';

Color.prototype.darken = function (amount = 1) {
    const me = this;
    const lab = me.lab();
    lab[0] -= LAB_CONSTANTS.Kn * amount;
    return new Color(lab, 'lab').alpha(me.alpha(), true);
};

Color.prototype.brighten = function (amount = 1) {
    return this.darken(-amount);
};

Color.prototype.darker = Color.prototype.darken;
Color.prototype.brighter = Color.prototype.brighten;
