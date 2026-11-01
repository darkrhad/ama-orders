import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative, so it works on GitHub Pages (/ama-orders/) and at a root alike.
  base: './',
  plugins: [react()],
  server: { port: 5300 },
});
