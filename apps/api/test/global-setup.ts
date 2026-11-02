import { MongoMemoryReplSet } from 'mongodb-memory-server';
import type { TestProject } from 'vitest/node';

declare module 'vitest' {
  export interface ProvidedContext {
    mongoUri: string;
  }
}

/**
 * Starts a single-node in-memory MongoDB replica set once for the whole test run.
 * A replica set (not a standalone server) is required for multi-document transactions.
 */
export default async function setup(project: TestProject) {
  const replSet = await MongoMemoryReplSet.create({
    replSet: { count: 1, storageEngine: 'wiredTiger' },
  });
  project.provide('mongoUri', replSet.getUri());

  return async () => {
    await replSet.stop();
  };
}
