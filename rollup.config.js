import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import buble from 'rollup-plugin-buble';
import {uglify} from 'rollup-plugin-uglify';

const production = !process.env.ROLLUP_WATCH;// && !process.env.ENV == 'dev';

module.exports = {
    input: 'index.js',
    output: {
        file: 'chroma.js',
        format: 'cjs',
        name: 'chroma',
    },
    plugins: [
        resolve(),
        commonjs(),

        // If we're building for production (npm run build
        // instead of npm run dev), transpile and minify
        production && buble({
            transforms: { dangerousForOf: true }
        }),
        production && uglify({
            mangle: true
        })

    ]
};
