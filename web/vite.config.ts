import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Para usar rutas absolutas y evitar ../../
  resolve: {
    alias: {
      "@": "/src",
    },
  },
})
