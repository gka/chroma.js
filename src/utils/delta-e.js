const Color = require('../Color');
const {sqrt, pow, min, max, atan2, abs, cos, sin, exp, PI} = Math;

module.exports = function(a, b, Kl=1, Kc=1, Kh=1) {
    // Delta E (CIE 2000)
    // see http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CIE2000.html
    var rad2deg = function(rad) {
        return 360 * rad / (2 * PI);
    };
    var deg2rad = function(deg) {
        return (2 * PI * deg) / 360;
    };
    a = new Color(a);
    b = new Color(b);
    const [L1,a1,b1] = Array.from(a.lab());
    const [L2,a2,b2] = Array.from(b.lab());
    const avgL = (L1 + L2)/2;
    const C1 = sqrt(pow(a1, 2) + pow(b1, 2));
    const C2 = sqrt(pow(a2, 2) + pow(b2, 2));
    const avgC = (C1 + C2)/2;
    const G = 0.5*(1-sqrt(pow(avgC, 7)/(pow(avgC, 7) + pow(25, 7))));
    const a1p = a1*(1+G);
    const a2p = a2*(1+G);
    const C1p = sqrt(pow(a1p, 2) + pow(b1, 2));
    const C2p = sqrt(pow(a2p, 2) + pow(b2, 2));
    const avgCp = (C1p + C2p)/2;
    const arctan1 = rad2deg(atan2(b1, a1p));
    const arctan2 = rad2deg(atan2(b2, a2p));
    const h1p = arctan1 >= 0 ? arctan1 : arctan1 + 360;
    const h2p = arctan2 >= 0 ? arctan2 : arctan2 + 360;
    const avgHp = abs(h1p - h2p) > 180 ? (h1p + h2p + 360)/2 : (h1p + h2p)/2;
    const T = 1 - 0.17*cos(deg2rad(avgHp - 30)) + 0.24*cos(deg2rad(2*avgHp)) + 0.32*cos(deg2rad(3*avgHp + 6)) - 0.2*cos(deg2rad(4*avgHp - 63));
    let deltaHp = h2p - h1p;
    deltaHp = abs(deltaHp) <= 180 ? deltaHp : h2p <= h1p ? deltaHp + 360 : deltaHp - 360;
    deltaHp = 2*sqrt(C1p*C2p)*sin(deg2rad(deltaHp)/2);
    const deltaL = L2 - L1;
    const deltaCp = C2p - C1p;    
    const sl = 1 + (0.015*pow(avgL - 50, 2))/sqrt(20 + pow(avgL - 50, 2));
    const sc = 1 + 0.045*avgCp;
    const sh = 1 + 0.015*avgCp*T;
    const deltaTheta = 30*exp(-pow((avgHp - 275)/25, 2));
    const Rc = 2*sqrt(pow(avgCp, 7)/(pow(avgCp, 7) + pow(25, 7)));
    const Rt = -Rc*sin(2*deg2rad(deltaTheta));
    const result = sqrt(pow(deltaL/(Kl*sl), 2) + pow(deltaCp/(Kc*sc), 2) + pow(deltaHp/(Kh*sh), 2) + Rt*(deltaCp/(Kc*sc))*(deltaHp/(Kh*sh)));
    return max(0, min(100, result));
};

