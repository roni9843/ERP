import { defineConfig } from 'eslint/config';
import { node } from '@erp/eslint-config/node';

export default defineConfig(node, {
  languageOptions: { parserOptions: { tsconfigRootDir: import.meta.dirname } },
});
