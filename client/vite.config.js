import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // Dev server on 3001 to avoid clashing with the Express port (3000)
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Forward API requests to the Express backend on 3000
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
