import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  // Skicka /api-anrop till Express-servern (server/) under utveckling
  server: {
    proxy: {
      '/api': 'http://localhost:4242',
    },
  },
})
