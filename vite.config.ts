import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      '@tensorflow/tfjs',
      'comlink',
      'tesseract.js',
      'leaflet',
      'leaflet.heat',
      'socket.io-client'
    ]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          tensorflow: ['@tensorflow/tfjs'],
          tesseract: ['tesseract.js'],
          leaflet: ['leaflet', 'leaflet.heat', 'react-leaflet'],
          socketio: ['socket.io-client'],
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            'framer-motion',
            'lucide-react'
          ]
        }
      }
    },
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    sourcemap: false
  },
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin'
    }
  }
});