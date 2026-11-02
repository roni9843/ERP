import { Schema, Types, type Aggregate, type MongooseQueryMiddleware, type Query } from 'mongoose';
import { requestContext } from '../../context/request-context';

/**
 * Tenant isolation for a shared-database, multi-tenant setup.
 * See docs/architecture/multi-tenancy.md.
 *
 * Every tenant-owned schema declares `tenantId: tenantIdField` and applies this plugin.
 * The plugin then:
 *  - stamps `tenantId` from the request context on new documents (validate / insertMany)
 *  - adds `{ tenantId }` to every query filter and prepends a `$match` to every aggregation
 *  - throws if there is no tenant in the context, so a forgotten filter fails loudly
 *    instead of leaking another tenant's data
 *
 * Platform-level code (for example login, which looks a user up by email across tenants) can opt
 * out explicitly with `.setOptions({ skipTenantScope: true })`. Keep such calls rare and reviewed.
 *
 * Not covered: `bulkWrite` and `estimatedDocumentCount`. Do not use them on tenant models.
 */

export const SKIP_TENANT_SCOPE = 'skipTenantScope';

export const tenantIdField = {
  type: Schema.Types.ObjectId,
  ref: 'Tenant',
  required: true,
  immutable: true,
  index: true,
} as const;

const SCOPED_QUERY_MIDDLEWARE: MongooseQueryMiddleware[] = [
  'countDocuments',
  'deleteMany',
  'deleteOne',
  'distinct',
  'find',
  'findOne',
  'findOneAndDelete',
  'findOneAndReplace',
  'findOneAndUpdate',
  'replaceOne',
  'updateMany',
  'updateOne',
];

export class MissingTenantContextError extends Error {
  constructor() {
    super(
      'Tenant context is missing. Run tenant-scoped queries inside an authenticated request, ' +
        'or pass { skipTenantScope: true } for a deliberate platform-level operation.',
    );
    this.name = 'MissingTenantContextError';
  }
}

function requireTenantId(): Types.ObjectId {
  const tenantId = requestContext.get()?.tenantId;
  if (!tenantId) throw new MissingTenantContextError();
  return new Types.ObjectId(tenantId);
}

function isSkipped(options: object | undefined): boolean {
  return (options as Record<string, unknown> | undefined)?.[SKIP_TENANT_SCOPE] === true;
}

export function tenantScopePlugin(schema: Schema): void {
  if (!schema.path('tenantId')) {
    schema.add({ tenantId: tenantIdField });
  }

  schema.pre(
    SCOPED_QUERY_MIDDLEWARE,
    { document: false, query: true },
    function (this: Query<unknown, unknown>) {
      if (isSkipped(this.getOptions())) return;
      this.where({ tenantId: requireTenantId() });
    },
  );

  schema.pre('aggregate', function (this: Aggregate<unknown>) {
    if (isSkipped(this.options)) return;
    this.pipeline().unshift({ $match: { tenantId: requireTenantId() } });
  });

  schema.pre('validate', function () {
    if (!this.get('tenantId')) {
      this.set('tenantId', requireTenantId());
    }
  });

  schema.pre('insertMany', function (docs: unknown) {
    const list = (Array.isArray(docs) ? docs : [docs]) as Record<string, unknown>[];
    for (const doc of list) {
      doc.tenantId ??= requireTenantId();
    }
  });
}
