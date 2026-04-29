import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    cssCodeSplit: false, // Força o CSS em um arquivo só para evitar problemas de ordem
    rollupOptions: {
      output: {
        manualChunks: undefined // Evita quebra de arquivos que pode causar delay de estilo
      }
    }
  }
})
