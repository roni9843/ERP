import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'test/**/*.test.ts'],
    // Starts one in-memory MongoDB replica set for the whole run (transactions need a replica set).
    globalSetup: ['./test/global-setup.ts'],
    // Connects each test file to its own throw-away database.
    setupFiles: ['./test/setup.ts'],
    testTimeout: 30_000,
    hookTimeout: 120_000,
    env: {
      NODE_ENV: 'test',
      LOG_LEVEL: 'silent',
      JWT_ACCESS_SECRET: 'test-only-secret-that-is-at-least-32-characters-long',
      MONGODB_URI: 'mongodb://replaced-by-test-setup',
    },
  },
});
