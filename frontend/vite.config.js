import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://web-backend.vercel.app', // Backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

