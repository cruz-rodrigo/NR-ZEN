import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Proxy removido para evitar erros de conexão em ambientes de preview estático.
  // As chamadas de API falharão graciosamente ou usarão URLs absolutas se configurado.
})