import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Dev server runs on :5173 to match capture.mjs (npm run capture:build).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173 },
});
