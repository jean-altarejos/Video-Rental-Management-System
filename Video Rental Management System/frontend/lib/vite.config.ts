import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/*// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

*/
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 7065,
    proxy: {
      '/api': {
        target: 'https://localhost:7065', // Your C# API HTTPS port
        changeOrigin: true,
        secure: false, // Allows self-signed SSL certs in dev
      },
    },
  },
})