import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'
import { name } from './package.json'

const r = (p) => resolve(__dirname, p)

export default defineConfig({
  resolve: {
    alias: {
      [name]: r('./index.js'),
    },
  },
})
