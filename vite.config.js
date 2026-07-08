import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

// Dev server runs on :5173 to match capture.mjs (npm run capture:build).
// Two MPA entries: the homepage and the research page.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173 },
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        research: fileURLToPath(new URL('./research.html', import.meta.url)),
      },
    },
  },
});
