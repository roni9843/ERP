import type { AuthSession } from '@erp/shared';
import type { Express } from 'express';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { bearer, createTestApp, signUp } from '../../../../../test/helpers';

const BASE = '/api/v1/crm/clients';

describe('CRM clients API', () => {
  let app: Express;
  let tenantA: AuthSession;
  let tenantB: AuthSession;

  beforeAll(async () => {
    app = await createTestApp();
    tenantA = await signUp(app, { companyName: 'Tenant A' });
    tenantB = await signUp(app, { companyName: 'Tenant B' });
  });

  it('requires authentication', async () => {
    await request(app).get(BASE).expect(401);
  });

  it('supports the full create / read / update / delete cycle', async () => {
    const auth = bearer(tenantA.accessToken);

    const created = await request(app)
      .post(BASE)
      .set(auth)
      .send({
        name: 'Al Noor Trading',
        vatNumber: '300000000000003',
        creditLimit: '15000.50',
        address: { buildingNumber: '1234', city: 'Riyadh', postalCode: '12345' },
      })
      .expect(201);

    expect(created.body).toMatchObject({
      code: expect.stringMatching(/^C-\d{6}$/),
      type: 'business',
      status: 'active',
      creditLimit: '15000.50',
      address: { city: 'Riyadh', countryCode: 'SA' },
    });
    expect(created.headers.location).toBe(`${BASE}/${created.body.id}`);

    const id = created.body.id as string;
    await request(app).get(`${BASE}/${id}`).set(auth).expect(200);

    const updated = await request(app)
      .patch(`${BASE}/${id}`)
      .set(auth)
      .send({ phone: '+966500000000', status: 'suspended' })
      .expect(200);
    expect(updated.body).toMatchObject({ phone: '+966500000000', status: 'suspended' });

    await request(app).delete(`${BASE}/${id}`).set(auth).expect(204);
    await request(app).get(`${BASE}/${id}`).set(auth).expect(404);
  });

  it('numbers clients sequentially per tenant', async () => {
    const session = await signUp(app);
    const auth = bearer(session.accessToken);

    const first = await request(app).post(BASE).set(auth).send({ name: 'First' }).expect(201);
    const second = await request(app).post(BASE).set(auth).send({ name: 'Second' }).expect(201);

    expect(first.body.code).toBe('C-000001');
    expect(second.body.code).toBe('C-000002');
  });

  it('rejects invalid Saudi identifiers with field-level details', async () => {
    const response = await request(app)
      .post(BASE)
      .set(bearer(tenantA.accessToken))
      .send({ name: 'Bad VAT', vatNumber: '123', crNumber: '12' })
      .expect(422);

    const paths = (response.body.error.details as { path: string }[]).map((d) => d.path);
    expect(paths).toEqual(expect.arrayContaining(['vatNumber', 'crNumber']));
  });

  it('isolates tenants: one company never sees or touches another company’s clients', async () => {
    const own = await request(app)
      .post(BASE)
      .set(bearer(tenantA.accessToken))
      .send({ name: 'Private Client of A' })
      .expect(201);
    const id = own.body.id as string;
    const authB = bearer(tenantB.accessToken);

    const list = await request(app).get(BASE).set(authB).query({ search: 'Private' }).expect(200);
    expect(list.body.total).toBe(0);

    await request(app).get(`${BASE}/${id}`).set(authB).expect(404);
    await request(app).patch(`${BASE}/${id}`).set(authB).send({ name: 'Hijacked' }).expect(404);
    await request(app).delete(`${BASE}/${id}`).set(authB).expect(404);

    const stillThere = await request(app)
      .get(`${BASE}/${id}`)
      .set(bearer(tenantA.accessToken))
      .expect(200);
    expect(stillThere.body.name).toBe('Private Client of A');
  });

  it('paginates, searches and sorts', async () => {
    const session = await signUp(app);
    const auth = bearer(session.accessToken);
    for (const name of ['Charlie Supplies', 'Alpha Rentals', 'Bravo Printing']) {
      await request(app).post(BASE).set(auth).send({ name }).expect(201);
    }

    const page = await request(app)
      .get(BASE)
      .set(auth)
      .query({ limit: 2, sort: 'name' })
      .expect(200);
    expect(page.body).toMatchObject({ page: 1, limit: 2, total: 3, totalPages: 2 });
    expect(page.body.items.map((c: { name: string }) => c.name)).toEqual([
      'Alpha Rentals',
      'Bravo Printing',
    ]);

    const search = await request(app).get(BASE).set(auth).query({ search: 'print' }).expect(200);
    expect(search.body.items.map((c: { name: string }) => c.name)).toEqual(['Bravo Printing']);
  });
});
