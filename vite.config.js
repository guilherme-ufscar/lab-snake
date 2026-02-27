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
    // Exclude Capacitor native folders from file-watching
    watch: {
      ignored: [
        path.resolve(__dirname, 'android') + '/**',
        path.resolve(__dirname, 'ios') + '/**',
      ],
    },
  },
});
