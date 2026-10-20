import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@generated': fileURLToPath(new URL('./.cache', import.meta.url)),
    },
  },
  test: { include: ['src/**/*.spec.{ts,tsx}', 'scripts/**/*.spec.{ts,tsx}'] },
});
