import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main.ts'],
  format: ['esm'],
  platform: 'node',
  target: 'node24',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  // @erp/shared ships TypeScript sources (internal package), so it is bundled into the API build.
  // Every other dependency stays external and is installed in the runtime image.
  noExternal: ['@erp/shared'],
});
