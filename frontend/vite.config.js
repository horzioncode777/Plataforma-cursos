import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "./", // 👈 asegura que los assets se carguen bien en cualquier dominio
  server: { port: 5174 },
})
