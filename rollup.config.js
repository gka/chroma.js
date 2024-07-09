import buble from "@rollup/plugin-buble";
import license from "rollup-plugin-license";
import replace from "@rollup/plugin-replace";
import path from "path";
import terser from "@rollup/plugin-terser";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const minify = !process.env.ROLLUP_WATCH && !process.env.DEV;
/** globals process, __dirname **/

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  bundle("index.js", "chroma"),
  bundle("index-light.js", "chroma-light"),
];

function bundle(input, target) {
  return {
    input,
    output: {
      file: `${target}${minify ? ".min" : ""}.cjs`,
      format: "umd",
      name: "chroma",
    },
    plugins: [
      replace({
        delimiters: ["@@", ""],
        preventAssignment: true,
        version: '0.4.2'
      }),

      // If we're building for production (npm run build
      // instead of npm run dev), transpile and minify
      buble({
        transforms: { dangerousForOf: true },
      }),
      minify &&
        terser({
          mangle: true,
        }),
      license({
        sourcemap: true,
        //cwd: '.', // Default is process.cwd()

        banner: {
          content: {
            file: path.join(__dirname, "LICENSE"),
          },
        },
      }),
    ],
  };
}
