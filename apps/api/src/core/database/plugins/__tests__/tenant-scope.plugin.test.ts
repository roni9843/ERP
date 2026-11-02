import { Schema, Types, model } from 'mongoose';
import { beforeAll, describe, expect, it } from 'vitest';
import { requestContext } from '../../../context/request-context';
import {
  MissingTenantContextError,
  SKIP_TENANT_SCOPE,
  tenantIdField,
  tenantScopePlugin,
} from '../tenant-scope.plugin';

const widgetSchema = new Schema({ tenantId: tenantIdField, name: String });
widgetSchema.plugin(tenantScopePlugin);
const Widget = model('TenantScopeTestWidget', widgetSchema);

const tenantA = new Types.ObjectId().toString();
const tenantB = new Types.ObjectId().toString();

function asTenant<T>(tenantId: string, fn: () => Promise<T>): Promise<T> {
  return requestContext.run({ requestId: 'test', locale: 'en', tenantId }, fn);
}

describe('tenantScopePlugin', () => {
  beforeAll(async () => {
    await Widget.init();
    await asTenant(tenantA, () => Widget.create({ name: 'A1' }));
    await asTenant(tenantA, () => Widget.insertMany([{ name: 'A2' }]));
    await asTenant(tenantB, () => Widget.create({ name: 'B1' }));
  });

  it('stamps tenantId on new documents and scopes reads', async () => {
    const names = await asTenant(tenantA, () => Widget.find().sort('name').exec());
    expect(names.map((w) => w.name)).toEqual(['A1', 'A2']);
    expect(await asTenant(tenantB, () => Widget.countDocuments().exec())).toBe(1);
  });

  it('scopes aggregations', async () => {
    const result = await asTenant(tenantB, () =>
      Widget.aggregate<{ total: number }>([{ $count: 'total' }]).exec(),
    );
    expect(result).toEqual([{ total: 1 }]);
  });

  it('cannot update or delete another tenant’s documents', async () => {
    const update = await asTenant(tenantB, () =>
      Widget.updateMany({ name: 'A1' }, { name: 'hacked' }).exec(),
    );
    expect(update.matchedCount).toBe(0);

    const removed = await asTenant(tenantB, () => Widget.deleteMany({}).exec());
    expect(removed.deletedCount).toBe(1); // only B's own widget

    expect(await asTenant(tenantA, () => Widget.countDocuments().exec())).toBe(2);
  });

  it('fails loudly when there is no tenant in the context', async () => {
    await expect(Widget.find().exec()).rejects.toThrow(MissingTenantContextError);
    await expect(Widget.create({ name: 'orphan' })).rejects.toThrow(MissingTenantContextError);
  });

  it('allows explicit platform-level queries', async () => {
    const all = await Widget.find()
      .setOptions({ [SKIP_TENANT_SCOPE]: true })
      .exec();
    expect(all.length).toBeGreaterThanOrEqual(2);
  });
});
