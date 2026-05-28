import { defineConfig } from 'vite';

/** Full Reflow PWA (HTML + TIDE visual layer) — project root */
export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
