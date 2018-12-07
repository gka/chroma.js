const type = require('./type');

module.exports = (args, keyOrder=null) => {
    if (args.length >= 3) return Array.prototype.slice.call(args);
	if (type(args[0]) == 'object' && keyOrder) {
		return keyOrder.split('').map(k => args[0][k]);
	}
    return args[0];
};
