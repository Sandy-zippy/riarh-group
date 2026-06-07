import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages project site → served from /riarh-group/
export default defineConfig({
  base: '/riarh-group/',
  plugins: [react(), tailwindcss()],
})
