import { randomUUID } from 'node:crypto';
import type { AuthSession, SignupInput } from '@erp/shared';
import type { Express } from 'express';
import request from 'supertest';
import { createApp } from '../src/app';
import { initModels } from '../src/core/database/connection';

/** Builds the app after making sure collections and indexes exist (needed before transactions). */
export async function createTestApp(): Promise<Express> {
  await initModels();
  return createApp();
}

/** Signs up a brand-new tenant and returns its owner's session. */
export async function signUp(
  app: Express,
  overrides: Partial<SignupInput> = {},
): Promise<AuthSession & { password: string }> {
  const input: SignupInput = {
    companyName: 'Test Trading Co.',
    name: 'Test Owner',
    email: `owner-${randomUUID()}@example.com`,
    password: 'correct-horse-battery-staple',
    ...overrides,
  };
  const response = await request(app).post('/api/v1/auth/signup').send(input).expect(201);
  return { ...(response.body as AuthSession), password: input.password };
}

export function bearer(token: string): { Authorization: string } {
  return { Authorization: `Bearer ${token}` };
}
