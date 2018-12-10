import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import buble from 'rollup-plugin-buble';
import license from 'rollup-plugin-license';
import path from 'path';

// import {uglify} from 'rollup-plugin-uglify';

/** globals process, __dirname **/

module.exports = {
    input: 'index.js',
    output: {
        file: `chroma.js`,
        format: 'umd',
        name: 'chroma',
    },
    plugins: [
        resolve(),
        commonjs(),

        // If we're building for production (npm run build
        // instead of npm run dev), transpile and minify
        buble({
            transforms: { dangerousForOf: true }
        }),
        // production && uglify({
        //     mangle: true
        // }),
        license({
            sourceMap: true,
            cwd: '.', // Default is process.cwd()

            banner: {
                file: path.join(__dirname, 'LICENSE'),
                encoding: 'utf-8', // Default is utf-8
            }
        }),
    ]
};
