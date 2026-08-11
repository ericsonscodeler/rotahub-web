import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { federation } from '@module-federation/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'operatorWeb',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
      },
      shared: ['react', 'react-dom'],
      bundleAllCSS: true,
    }),
  ],
  server: {
    port: 5173,
    origin: 'http://localhost:5173',
  },
  build: {
    target: 'esnext',
  },
})
