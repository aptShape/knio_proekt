import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: '/knio_proekt/',  // <-- YOUR GitHub repo name here, with slashes
    plugins: [react()],
})
