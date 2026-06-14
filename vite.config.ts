import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves this project at /<repo>/, not /. Set base so the
// built asset URLs resolve under the subpath instead of 404-ing to root.
export default defineConfig({
  base: '/perkpass-membership-demo/',
  plugins: [react(), tailwindcss()],
})
