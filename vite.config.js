import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false,
      // 👉 ACÁ ESTÁ EL SALVAVIDAS PARA VERCEL
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,json,lottie}'],
        maximumFileSizeToCacheInBytes: 8000000 // Subimos el límite a 8MB por las dudas
      }
    })
  ],
})
