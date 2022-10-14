import { defineConfig } from 'vite'
const path = require('path')

export default defineConfig({
    assetsInclude: ['**/*.mp4'],
  root: path.resolve(__dirname, 'src'),
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    }
  },
  server: {
    port: 8080,
    hot: true
  }
})

