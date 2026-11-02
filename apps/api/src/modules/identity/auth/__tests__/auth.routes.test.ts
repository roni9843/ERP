import type { Express } from 'express';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { bearer, createTestApp, signUp } from '../../../../../test/helpers';

describe('auth routes', () => {
  let app: Express;

  beforeAll(async () => {
    app = await createTestApp();
  });

  it('signs up a company with its owner and returns a session', async () => {
    const session = await signUp(app, { companyName: 'Riyadh Events Co.' });

    expect(session.accessToken).toEqual(expect.any(String));
    expect(session.user).toMatchObject({ role: 'owner' });
    expect(session.tenant).toMatchObject({
      name: 'Riyadh Events Co.',
      countryCode: 'SA',
      baseCurrency: 'SAR',
      status: 'trial',
    });
  });

  it('returns the current user and tenant for a valid token', async () => {
    const session = await signUp(app);
    const response = await request(app)
      .get('/api/v1/auth/me')
      .set(bearer(session.accessToken))
      .expect(200);

    expect(response.body.user.id).toBe(session.user.id);
    expect(response.body.tenant.id).toBe(session.tenant.id);
  });

  it('rejects a duplicate email', async () => {
    const session = await signUp(app);
    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        companyName: 'Other',
        name: 'Other',
        email: session.user.email.toUpperCase(),
        password: 'another-password',
      })
      .expect(409);

    expect(response.body.error.code).toBe('EMAIL_TAKEN');
  });

  it('logs in with the right password and refuses the wrong one', async () => {
    const session = await signUp(app);

    await request(app)
      .post('/api/v1/auth/login')
      .send({ email: session.user.email, password: session.password })
      .expect(200);

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: session.user.email, password: 'wrong-password' })
      .expect(401);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });

  it('validates the payload with the shared schema', async () => {
    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send({ companyName: 'X', name: '', email: 'not-an-email', password: 'short' })
      .expect(422);

    const paths = (response.body.error.details as { path: string }[]).map((d) => d.path);
    expect(paths).toEqual(expect.arrayContaining(['companyName', 'name', 'email', 'password']));
  });

  it('requires a bearer token for /me', async () => {
    await request(app).get('/api/v1/auth/me').expect(401);
    await request(app).get('/api/v1/auth/me').set(bearer('not-a-jwt')).expect(401);
  });
});
