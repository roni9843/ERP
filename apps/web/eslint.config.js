import { defineConfig } from 'eslint/config';
import { react } from '@erp/eslint-config/react';

export default defineConfig(react, {
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    parserOptions: {
      tsconfigRootDir: import.meta.dirname,
      projectService: {
        // Tooling files live in tsconfig.node.json (Node types), not in the browser tsconfig.
        allowDefaultProject: ['vite.config.ts', 'playwright.config.ts', 'e2e/*.ts'],
        defaultProject: 'tsconfig.node.json',
      },
    },
  },
});
