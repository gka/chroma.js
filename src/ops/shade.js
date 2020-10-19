const Color = require('../Color');
const mix = require('../generator/mix');

Color.prototype.shade = function(f=0.5, ...rest) {
	return mix(this, 'black', f, ...rest);
}
