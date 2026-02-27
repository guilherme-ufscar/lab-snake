import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    watch: {
      ignored: ['**/android/**', '**/ios/**'],
    },
    fs: {
      deny: ['android', 'ios'],
    },
  },
});
