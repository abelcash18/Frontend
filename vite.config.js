import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/Frontend',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}']
      },
      includeAssets: ['favicon.png', 'logo.jpg', 'logo 2.jpg'],
      manifest: {
        name: 'Dewgates Consults',
        short_name: 'Dewgates',
        description: 'Buy, Sell and Rent Properties',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/logo.jpg',
            sizes: '192x192',
            type: 'image/jpg'
          },
          {
            src: '/logo 5.jpg',
            sizes: '512x512',
            type: 'image/jpg'
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/auth': 'https://backend-dewgates-consults.onrender.com'
    }
  }
})

