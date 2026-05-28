import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** React TIDE UI prototype (mock data) */
export default defineConfig({
  plugins: [react()],
  root: 'prototype',
  server: {
    port: 5174,
    open: true,
  },
  build: {
    outDir: '../dist-prototype',
    emptyOutDir: true,
  },
});
