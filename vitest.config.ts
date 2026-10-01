import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  resolve: {
    alias: {
      '@ptq/shared': fileURLToPath(new URL('./packages/shared/src/index.ts', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: [
      'apps/backend/test/**/*.test.ts',
      'packages/shared/test/**/*.test.ts',
      'apps/frontend/src/features/themes/**/*.test.ts',
      'scripts/**/*.test.mjs',
    ],
    clearMocks: true,
    restoreMocks: true,
  },
});
