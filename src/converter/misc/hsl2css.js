const rnd = (a) => Math.round(a*100)/100;

const hsl2css = (hsla, mode='hsl') => {
    hsla[0] = rnd(hsla[0] || 0);
    hsla[1] = rnd(hsla[1]*100) + '%';
    hsla[2] = rnd(hsla[2]*100) + '%';
    if (mode === 'hsla' || (hsla.length > 3 && hsla[3]<1)) {
        hsla[3] = hsla.length > 3 ? hsla[3] : 1;
        mode = 'hsla';
    } else {
        hsla.length = 3;
    }
    return `${mode}(${hsla.join(',')})`;
}

module.exports = hsl2css;

