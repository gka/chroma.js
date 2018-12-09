const {last, clip_rgb} = require('./utils');
const _input = require('./io/input');

class Color {

    constructor(...args) {
        const me = this;

        // last argument could be the mode
        let mode = last(args);

        console.log(mode, _input[mode] ? 'y' : 'f', args.slice(0,-1));

        if (_input[mode]) {
            // we know the exact input mode from the last parameter
            me._rgb = clip_rgb(_input[mode].apply(null, args.slice(0,-1)));
        } else {
            // we need to guess the input mode
        }
    }

}

module.exports = Color;
