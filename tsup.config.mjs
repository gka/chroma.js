import { defineConfig } from 'tsup'
import license from 'esbuild-plugin-license'

export default defineConfig({
  entry: [
    './index.js',
    './index-light.js',
  ],
  clean: true,
  format: ['esm', 'cjs'],
  minify: true,
  esbuildPlugins: [license()]
})
