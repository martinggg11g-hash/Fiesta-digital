import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        // 👉 ACÁ ESTIRAMOS EL LÍMITE A 10 MB
        maximumFileSizeToCacheInBytes: 10485760,
        // Y le dejamos a Vercel las reglas claras para que no se queje
        globPatterns: ['**/*.{js,css,html,ico,png,svg,lottie,json}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image' || request.destination === 'document' || request.destination === 'script',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'fiesta-app-cache',
            }
          }
        ]
      }
    })
  ],
})
