import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/Plataforma-cursos.io/' : '/', // ← nuevo nombre EXACTO
  server: { port: 5174 },
}))
