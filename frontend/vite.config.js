import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración para permitir acceso desde cualquier red o túnel
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // permite acceso desde cualquier IP (LAN, WiFi, ngrok, etc.)
    port: 5173, // puerto que expones
    allowedHosts: ['.ngrok-free.app', 'localhost', '127.0.0.1', '0.0.0.0'], // acepta cualquier dominio ngrok o red local
    cors: {
      origin: '*', // permite solicitudes desde cualquier origen
      credentials: true, // habilita envío de cookies (si usas Sanctum)
    },
  },
})
