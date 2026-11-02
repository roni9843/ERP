# Multi-tenancy

A **tenant** is one customer company. All tenants share one deployment and one database. **Leaking one tenant's data to another is the worst bug this product can have**, so isolation is enforced by infrastructure, not by developer discipline alone.

## Model: shared database, tenant discriminator

Every tenant-owned document carries `tenantId`. See [ADR 0005](../adr/0005-shared-database-multi-tenancy.md).

| Option                 | Isolation                           | Ops cost                               | Cross-tenant analytics | Verdict                            |
| ---------------------- | ----------------------------------- | -------------------------------------- | ---------------------- | ---------------------------------- |
| Shared DB + `tenantId` | Logical, enforced by plugin + tests | Lowest                                 | Easy                   | ✅ **chosen**                      |
| Database per tenant    | Physical                            | High (thousands of DBs, migrations ×N) | Hard                   | Possible later for large customers |
| Cluster per tenant     | Strongest                           | Very high                              | Hard                   | Enterprise / regulated deals only  |

## How isolation is enforced

1. **Token.** The access token carries `tid` (tenant id). `authenticate` verifies it and writes `tenantId` into the request context (AsyncLocalStorage).
2. **Plugin (fail closed).** `tenantScopePlugin`:
   - adds `{ tenantId }` to every query (`find*`, `count`, `update*`, `delete*`, `replaceOne`, `distinct`) and prepends `$match` to every aggregation;
   - stamps `tenantId` on new documents (`validate`, `insertMany`);
   - **throws `MissingTenantContextError`** when there is no tenant in the context, so a query that "forgot" the tenant fails loudly instead of returning everyone's data.
3. **Indexes.** Every compound index on a tenant collection **starts with `tenantId`**. Per-tenant uniqueness is `{ tenantId: 1, field: 1 }, { unique: true }`.
4. **Tests.** Each module has an isolation test: tenant B gets `404` for tenant A's record on read, update and delete, and list and search return nothing (see `clients.routes.test.ts`). The plugin has its own tests.

## Rules for developers

- Every tenant-owned schema declares `tenantId: tenantIdField` and applies `tenantScopePlugin`.
- Do **not** use `bulkWrite` or `estimatedDocumentCount` on tenant models (the plugin cannot scope them).
- Opting out (`.setOptions({ skipTenantScope: true })`) is allowed only for deliberate **platform-level** operations, and must be reviewed. Today the only case is login, which looks a user up by email before the tenant is known.
- Background jobs, scripts and event handlers run outside HTTP requests. They must enter the tenant explicitly:
  `requestContext.run({ requestId, locale: 'ar', tenantId }, () => job())`.
- Never accept `tenantId` from the request body or query. It comes from the token only.

## Platform-level vs tenant-level collections

| Level    | Collections                                                    | Plugin |
| -------- | -------------------------------------------------------------- | ------ |
| Platform | `tenants` (later: `plans`, `subscriptions`, `platform_admins`) | no     |
| Tenant   | `users`, `clients`, `sequences`, and every business collection | yes    |

## Users and tenants

Today **one email = one login = one tenant**: `users.email` is unique platform-wide, so login needs no company picker. If a person must work for several companies (for example accountants serving several clients), introduce a `memberships` collection (`userId`, `tenantId`, `role`) and a tenant switcher. The token keeps carrying exactly one `tid`.

## Branches (planned)

Inside a tenant, **branches** separate users, treasuries, warehouses, POS devices, numbering sequences and print templates. Clients, products and suppliers can be shared across branches or kept separate (a per-tenant setting). Documents will carry `branchId`, and users will have allowed branches. The request context will gain `branchId`.

## Tenant lifecycle

`signup → trial → active ⇄ suspended → (export / delete)`

- **Signup** creates the tenant and its owner in one transaction.
- **Suspended** tenants cannot log in. Their data is kept.
- **Export and deletion**: required for customer offboarding and by the Saudi **PDPL** (data subject rights). Planned.

## Feature flags and plans (planned)

`tenants.enabledModules` switches modules on per tenant (an "apps manager"). Subscription **plans** will define quotas (users, branches, invoices per month, modules). Routes of a disabled module will answer `403 MODULE_DISABLED`, and the UI will hide them.

## Scaling path

`tenantId` everywhere keeps every future option open: shard MongoDB on `tenantId`, or move a large tenant to a dedicated database by routing its connection by `tenantId`. Neither changes business code.
