import { defineConfig } from 'vitest/config';
import tsconfig from './tsconfig.json' with { type: 'json' };

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    globals: false,
    pool: 'threads',
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    extensions: ['.ts', '.tsx'],
  },
  esbuild: {
    target: (tsconfig as { compilerOptions?: { target?: string } }).compilerOptions?.target ?? 'ES2020',
  },
});
