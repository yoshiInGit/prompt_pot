// vitest.config.ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node', // または 'jsdom'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
