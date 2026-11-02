import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createTestApp } from '../../../../test/helpers';

describe('GET /api/v1/health', () => {
  it('reports the service and database as healthy', async () => {
    const app = await createTestApp();
    const response = await request(app).get('/api/v1/health').expect(200);

    expect(response.body).toMatchObject({ status: 'ok', database: 'up' });
    expect(response.headers['x-request-id']).toBeTruthy();
  });

  it('returns the documented error envelope for unknown routes', async () => {
    const app = await createTestApp();
    const response = await request(app).get('/api/v1/does-not-exist').expect(404);

    expect(response.body.error).toMatchObject({ code: 'NOT_FOUND' });
    expect(response.body.error.requestId).toBe(response.headers['x-request-id']);
  });

  it('serves the OpenAPI document', async () => {
    const app = await createTestApp();
    const response = await request(app).get('/api/openapi.json').expect(200);

    expect(response.body.openapi).toBe('3.1.0');
    expect(Object.keys(response.body.paths)).toEqual(
      expect.arrayContaining(['/health', '/auth/login', '/crm/clients', '/crm/clients/{id}']),
    );
  });
});
