const Color = require('../Color');
const {sqrt, atan2, abs, cos, sin, exp, PI} = Math;

/*module.exports = function(a, b, L=1, C=1) {
    // Delta E (CMC)
    // see http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CMC.html
    a = new Color(a);
    b = new Color(b);
    const [L1,a1,b1] = Array.from(a.lab());
    const [L2,a2,b2] = Array.from(b.lab());
    const c1 = sqrt((a1 * a1) + (b1 * b1));
    const c2 = sqrt((a2 * a2) + (b2 * b2));
    const sl = L1 < 16.0 ? 0.511 : (0.040975 * L1) / (1.0 + (0.01765 * L1));
    const sc = ((0.0638 * c1) / (1.0 + (0.0131 * c1))) + 0.638;
    let h1 = c1 < 0.000001 ? 0.0 : (atan2(b1, a1) * 180.0) / PI;
    while (h1 < 0) { h1 += 360; }
    while (h1 >= 360) { h1 -= 360; }
    const t = (h1 >= 164.0) && (h1 <= 345.0) ? (0.56 + abs(0.2 * cos((PI * (h1 + 168.0)) / 180.0))) : (0.36 + abs(0.4 * cos((PI * (h1 + 35.0)) / 180.0)));
    const c4 = c1 * c1 * c1 * c1;
    const f = sqrt(c4 / (c4 + 1900.0));
    const sh = sc * (((f * t) + 1.0) - f);
    const delL = L1 - L2;
    const delC = c1 - c2;
    const delA = a1 - a2;
    const delB = b1 - b2;
    const dH2 = ((delA * delA) + (delB * delB)) - (delC * delC);
    const v1 = delL / (L * sl);
    const v2 = delC / (C * sc);
    const v3 = sh;
    return sqrt((v1 * v1) + (v2 * v2) + (dH2 / (v3 * v3)));
};*/

module.exports = function(a, b, L=1, C=1) {
    // Delta E (CIE 2000)
    // see http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CIE2000.html
    a = new Color(a);
    b = new Color(b);
    const [L1,a1,b1] = Array.from(a.lab());
    const [L2,a2,b2] = Array.from(b.lab());
    const avgL = (L1 + L2)/2;
    const c1 = sqrt((a1 * a1) + (b1 * b1));
    const c2 = sqrt((a2 * a2) + (b2 * b2));
    const avgC = (c1 + c2)/2;
    const G = 0.5(1-sqrt((avgC^7)/(avgC^7 + 25^7)));
    const a1p = a1*(1+G);
    const a2p = a2*(1+G);
    const c1p = sqrt(a1p^2 + b1^2);
    const c2p = sqrt(a2p^2 + b2^2);
    const avgCp = (c1p + c2p)/2;
    
    const arctan1 = atan2(b1, a1p);
    const arctan2 = atan2(b2, a2p);

    const h1p = arctan1 >= 0 ? arctan1 : arctan1 + 360;
    const h2p = arctan2 >= 0 ? arctan2 : arctan2 + 360;

    const avgHp = abs(h1p - h2p) > 180 ? (h1p + h2p + 360)/2 : (h1p + h2p)/2;

    const T = 1 - 0.17*cos(avgHp - 30) + 0.24*cos(2*avgHp) + 0.32*cos(3*avgHp + 6) - 0.2*cos(4*avgHp - 63);

    const hpdiff = h2p - h1p
    const deltahp = abs(hpdiff) <= 180 ? hpdiff : hpdiff > 180 && h2p <= h1p ? hpdiff + 360 : hpdiff - 360; // different from deltaHp

    const deltaL = L2 - L1
    const deltaCp = c2p - c1p

    const deltaHp = 2*sqrt(c1p*c2p)*sin(deltahp/2);

    const sl = 1 + (0.015(avgL - 50)^2)/sqrt(20 + (avgL - 50)^2);
    const sc = 1 + 0.045*avgCp;
    const sh = 1 + 0.015*avgCp*T;

    const deltaTheta = 30*exp(-(((avgHp - 275)/25)^2));

    const Rc = 2*sqrt((avgCp^7)/(avgCp^7+25^7));
    const Rt = -Rc*sin(2*deltaTheta);
    const Kl = 1;
    const Kc = 1;
    const Kh = 1;

    const result = sqrt((deltaL/(Kl*sl))^2 + (deltaCp/(Kc*sc))^2 + (deltaHp/(Kh*sh))^2 + Rt*(deltaCp/(Kc*sc))*(deltaHp/(Kh*sh)))
    return result;
};

