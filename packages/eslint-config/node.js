import { defineConfig } from 'eslint/config';
import globals from 'globals';
import { base } from './base.js';

/** Flat config for Node.js code (the API and shared libraries). */
export const node = defineConfig(base, {
  languageOptions: {
    globals: { ...globals.node },
  },
});

export default node;
