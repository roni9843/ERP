import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';
import { afterAll, beforeAll, inject } from 'vitest';
import { connectDatabase, disconnectDatabase } from '../src/core/database/connection';

// Runs before every test file: each file gets its own throw-away database.
const mongoUri = inject('mongoUri');
process.env.MONGODB_URI = mongoUri;

beforeAll(async () => {
  await connectDatabase(mongoUri, { dbName: `test_${randomUUID().replaceAll('-', '')}` });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await disconnectDatabase();
});
