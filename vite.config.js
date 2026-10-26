import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  base: './', // Relative base path so it works in GitHub Pages sub-directories
  plugins: [
    react(),
    tailwindcss()
  ]
});
