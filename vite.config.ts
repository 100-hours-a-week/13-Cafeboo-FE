import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite'
import { imagetools } from 'vite-imagetools';

export default defineConfig({
  plugins: [
    react(), 
    tsconfigPaths(), 
    tailwindcss(), 
    imagetools(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
    strictPort: false,
  },
  define: {
    global: 'globalThis',
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.webp', '**/*.avif'],
});
