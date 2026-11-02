import { defineConfig } from 'eslint/config';
import { node } from '@erp/eslint-config/node';

export default defineConfig(
  node,
  {
    languageOptions: { parserOptions: { tsconfigRootDir: import.meta.dirname } },
  },
  {
    // HTTP responses in tests are untyped (`any`); relax the unsafe-* rules there only.
    files: ['**/*.test.ts', 'test/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
    },
  },
);
