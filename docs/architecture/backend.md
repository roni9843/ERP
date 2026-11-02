# Backend architecture (`apps/api`)

Express 5 · Mongoose 9 · Zod 4 · TypeScript 6 (strict, ESM).

## Folder structure

```
apps/api/
├── src/
│   ├── main.ts                    # Process entry: env, DB connect, init models, listen, graceful shutdown
│   ├── app.ts                     # createApp(): middleware chain + module routers (no listen → testable)
│   ├── config/env.ts              # Zod-validated environment, lazy and cached (getConfig)
│   ├── core/                      # Framework code. NO business logic here.
│   │   ├── context/               # AsyncLocalStorage request context (requestId, tenantId, userId, role, locale)
│   │   ├── database/
│   │   │   ├── connection.ts      # connect / initModels / disconnect; strictQuery + transactionAsyncLocalStorage
│   │   │   ├── transaction.ts     # withTransaction(fn)
│   │   │   └── plugins/           # tenant-scope (isolation), audit-fields (createdBy/updatedBy)
│   │   ├── errors/app-error.ts    # AppError + helpers (unauthorized, forbidden, notFound, conflict)
│   │   ├── http/
│   │   │   ├── middleware/        # request-id, http-logger, security-headers, request-context,
│   │   │   │                      # authenticate, authorize, rate-limit, error-handler
│   │   │   └── query.ts           # escapeRegex, parseSort, paginate
│   │   ├── logger/                # Pino
│   │   ├── modules/app-module.ts  # AppModule contract
│   │   ├── numbering/sequence.ts  # Atomic per-tenant counters, document number formatting
│   │   ├── openapi/registry.ts    # OpenAPI registry, helpers, document generation
│   │   └── security/              # password hashing (argon2id), JWT sign/verify
│   └── modules/                   # Feature modules (see src/modules/README.md)
│       ├── index.ts               # The list of mounted modules
│       ├── health/
│       ├── platform/tenants/      # Tenant model (platform level, not tenant-scoped)
│       ├── identity/              # users (model), auth (signup / login / me)
│       └── crm/clients/           # ★ Reference module: copy its structure
└── test/
    ├── global-setup.ts            # One in-memory MongoDB replica set per test run
    ├── setup.ts                   # One throw-away database per test file
    └── helpers.ts                 # createTestApp(), signUp(), bearer()
```

## Layers and their rules

| Layer      | File                     | May use                                                                             | Must not                                 |
| ---------- | ------------------------ | ----------------------------------------------------------------------------------- | ---------------------------------------- |
| Route      | `<entity>.routes.ts`     | `authenticate`, `authorize(...)`, controller handlers                               | contain logic                            |
| Controller | `<entity>.controller.ts` | `req` / `res`, shared Zod schemas (`.parse`), service functions                     | touch models, catch errors to hide them  |
| Service    | `<entity>.service.ts`    | models, other modules' **services**, `withTransaction`, `AppError`, request context | import Express types, read `req` / `res` |
| Model      | `<entity>.model.ts`      | Mongoose, plugins, shared enums                                                     | contain business workflows               |

Errors propagate: throw an `AppError` (or let a `ZodError` bubble up). Express 5 forwards rejected promises to the central error handler, so **do not wrap handlers in try/catch** just to call `next(err)`.

## Anatomy of a module (CRM → Clients)

```
modules/crm/clients/
├── client.model.ts        # schema: tenantId: tenantIdField, fields, plugins, indexes ({ tenantId, code } unique)
├── client.service.ts      # listClients / getClient / createClient / updateClient / deleteClient + toClientDto
├── client.controller.ts   # parse with clientCreateSchema etc., call the service, send the response
├── client.routes.ts       # Router + authenticate + authorize(PERMISSIONS.CRM_CLIENTS_*)
├── client.openapi.ts      # registerPath(...) for every route (side-effect import)
├── index.ts               # export const clientsModule: AppModule = { name, basePath, router }
└── __tests__/clients.routes.test.ts   # CRUD, validation, pagination, tenant isolation
```

### Checklist: adding a module

1. Shared contract: add Zod schemas and DTO types to `packages/shared/src/schemas/<area>/<entity>.ts`, give response DTOs a `.meta({ id: 'Name' })`, and export them from `packages/shared/src/index.ts`.
2. Permissions: add keys to `packages/shared/src/permissions/catalog.ts` and grant them to roles.
3. Model: declare `tenantId: tenantIdField`, apply `tenantScopePlugin` (and `auditFieldsPlugin` when useful), and start every compound index with `tenantId`.
4. Service, controller, routes, openapi, index: follow the clients module.
5. Register the module in `src/modules/index.ts`.
6. Tests: at least CRUD through HTTP, validation (422), permissions, and **a tenant-isolation test**.

## Data modeling rules

- **Money and quantities**: `Schema.Types.Decimal128` in MongoDB and decimal strings in DTOs. Do the math with `@erp/shared` (`Money`, `roundMoney`, `calculateLine`). Never use JavaScript `number` arithmetic for money.
- **Enums** come from `@erp/shared` constants (`CLIENT_TYPES`, `SYSTEM_ROLES`, `CURRENCY_CODES`), so the API and the UI share them.
- **Timestamps**: `{ timestamps: true }` on every schema. Store UTC; the UI renders in `Asia/Riyadh`.
- **Identifiers**: ObjectId internally; human-readable numbers (`C-000001`, `INV-…`) come from `nextSequenceValue` and are unique per tenant.
- **Immutability of financial documents**: once issued, invoices and journal entries are never edited in place. Corrections use credit notes, debit notes or reversals (see [accounting-engine.md](accounting-engine.md)).
- **Deletion**: hard delete only for records nothing references. Planned: a recycle bin (soft delete with `deletedAt`, purged after 90 days), and "cannot delete, it has transactions" checks.

## Validation and DTOs

- Controllers call `schema.parse(req.body | req.query | req.params)`. The result is fully typed, and a `ZodError` becomes `422 VALIDATION_ERROR` with per-field `details`.
- Services return **DTOs** built by explicit mapping functions (`toClientDto`). Never return Mongoose documents: that would leak internals such as `tenantId`, `__v` and `passwordHash`.

## Transactions

```ts
await withTransaction(async () => {
  const invoice = await new InvoiceModel(data).save(); // joins the transaction automatically
  await postJournalEntry(invoice); // same transaction
  await moveStock(invoice); // same transaction
});
```

`transactionAsyncLocalStorage` is enabled, so you do not pass sessions around. Collections must exist before a transaction runs; startup calls `initModels()`, and tests call it in `createTestApp()`.

## OpenAPI

Each module registers its routes in `<entity>.openapi.ts`, using the **same** Zod schemas that validate requests. Schemas with `.meta({ id })` become reusable components. The document is served at `/api/openapi.json` and rendered by Scalar at `/api/docs`.

## Logging

Use `getLogger()`, never `console.log` (lint warns). Log objects, not strings: `logger.info({ invoiceId }, 'Invoice issued')`. Every HTTP log line carries the request id, which is also returned in the `x-request-id` header and in error bodies.

## Testing

| Kind                           | Tooling                                    | Example                                                       |
| ------------------------------ | ------------------------------------------ | ------------------------------------------------------------- |
| Pure logic (tax, money, rules) | Vitest                                     | `packages/shared/src/tax/line-calculator.test.ts`             |
| Plugin / infrastructure        | Vitest + in-memory MongoDB                 | `core/database/plugins/__tests__/tenant-scope.plugin.test.ts` |
| HTTP integration               | Vitest + Supertest + in-memory replica set | `modules/crm/clients/__tests__/clients.routes.test.ts`        |

`test/global-setup.ts` starts one replica set for the run; `test/setup.ts` gives each test file its own database, so files can run in parallel.

## Planned infrastructure

- **Background jobs** (BullMQ on Redis): recurring invoices, reminders, ZATCA submission retries, back-dated cost recalculation, emails. Jobs must re-enter the tenant context with `requestContext.run({ tenantId, … })`.
- **Domain events / outbox**: "invoice issued", "payment received" and similar, consumed by accounting and notifications.
- **File storage**: S3-compatible (MinIO locally) for attachments and generated PDFs.
- **Refresh tokens**: see [security.md](security.md).
