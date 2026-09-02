import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: 'apps/loanflow',
  cacheDir: '../../node_modules/.vite/loanflow',
  plugins: [react()],
  resolve: {
    alias: {
      '@loanflow/ui': fileURLToPath(new URL('../../libs/ui/src', import.meta.url)),
      '@loanflow/domain': fileURLToPath(new URL('../../libs/domain/src', import.meta.url)),
      '@loanflow/application-state': fileURLToPath(new URL('../../libs/application-state/src', import.meta.url)),
      '@loanflow/api': fileURLToPath(new URL('../../libs/api/src', import.meta.url))
    }
  },
  server: {
    host: '127.0.0.1',
    port: 4200
  },
  preview: {
    host: '127.0.0.1',
    port: 4300
  },
  build: {
    outDir: '../../dist/apps/loanflow',
    emptyOutDir: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['../../libs/**/*.spec.ts', 'src/**/*.spec.{ts,tsx}']
  }
});
