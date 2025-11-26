
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/urb_web/', // Sets the base path for deployment to https://<USERNAME>.github.io/urb_web/
})
