// some pre-defined color scales:
import chroma from '../chroma.js';
import '../io/hsl/index.js';
import scale from '../generator/scale.js';

export default {
    cool() {
        return scale([chroma.hsl(180, 1, 0.9), chroma.hsl(250, 0.7, 0.4)]);
    },
    hot() {
        return scale(['#000', '#f00', '#ff0', '#fff'], [0, 0.25, 0.75, 1]).mode(
            'rgb'
        );
    }
};
