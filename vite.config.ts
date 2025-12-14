import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Permite que variáveis começando com NEXT_PUBLIC_ sejam acessíveis via import.meta.env
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
})