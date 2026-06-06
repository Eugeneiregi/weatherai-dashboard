import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/v1': {
        target: 'https://api.weather-ai.co',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
