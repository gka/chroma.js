import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    './index.js',
    './index-light.js',
  ],
  clean: true,
  format: ['esm', 'cjs'],
  minify: true,
})
