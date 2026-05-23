import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        // Límite masivo de 50MB para que el build no crashee por ningún archivo
        maximumFileSizeToCacheInBytes: 52428800,
        
        // Archivos básicos a pre-cachear
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,jpg,jpeg}'],
        
        // IGNORAMOS explícitamente archivos gigantes o multimedia para cuidar la memoria
        globIgnores: ['**/*.{mp4,mp3,mov,gif,lottie,zip,wav}'],
        
        // Usamos Regex (100% seguro en el build) en lugar de funciones
        runtimeCaching: [
          {
            // Cache para imágenes (CacheFirst)
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 días
              }
            }
          },
          {
            // Cache para código y estilos (StaleWhileRevalidate)
            urlPattern: /\.(?:js|css)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
            }
          }
        ]
      }
    })
  ],
})
