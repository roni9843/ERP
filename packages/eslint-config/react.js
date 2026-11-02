import { defineConfig } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import { base } from './base.js';

/** Flat config for the React single-page app. */
export const react = defineConfig(base, {
  files: ['**/*.{ts,tsx}'],
  extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
  languageOptions: {
    globals: { ...globals.browser },
  },
});

export default react;
