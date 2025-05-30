import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/knio_proekt/',  // exactly your GitHub repo name with slashes
  plugins: [react()]
})
