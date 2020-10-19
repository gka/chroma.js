const Color = require('../Color');
const mix = require('../generator/mix');

Color.prototype.tint = function(f=0.5, ...rest) {
	return mix(this, 'white', f, ...rest);
}
