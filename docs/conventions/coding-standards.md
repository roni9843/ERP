# Coding standards

Tooling enforces most of this: TypeScript strict mode, type-aware ESLint, and Prettier on commit. This page covers what tools cannot check.

## TypeScript

- `strict` and `noUncheckedIndexedAccess` are on. Do not weaken them per file.
- No `any`. Use `unknown` and narrow it. In tests, untyped HTTP bodies are the only accepted exception (lint is relaxed there).
- Use `import type { … }` for types (`verbatimModuleSyntax`); ESLint auto-fixes this.
- Prefer `interface` for object shapes that are exported, and `type` for unions and helpers.
- Derive types from schemas (`z.infer<typeof schema>`) instead of writing them twice.
- Exported functions that are part of a module's public surface get a short doc comment explaining _why_ or _what rule_ they implement, not _how_.

## Naming

| Thing            | Convention                            | Example                                       |
| ---------------- | ------------------------------------- | --------------------------------------------- |
| Backend files    | kebab-case + role suffix              | `client.service.ts`, `tenant-scope.plugin.ts` |
| React components | PascalCase file = component           | `ClientsPage.tsx`, `FormField.tsx`            |
| Hooks            | `use` prefix                          | `useClients`, `useCan`                        |
| Zod schemas      | `<thing>Schema`                       | `clientCreateSchema`                          |
| DTO types        | `<Thing>Dto`                          | `ClientDto`                                   |
| Permissions      | `module.resource.action`              | `crm.clients.read`                            |
| Collections      | plural, lowerCamel (Mongoose default) | `clients`, `sequences`                        |
| Env vars         | SCREAMING_SNAKE                       | `JWT_ACCESS_TTL`                              |
| Translation keys | `area.subarea.key`                    | `clients.fields.vatNumber`                    |

## Money, numbers and dates

- **Money is never a JS `number` in calculations.** Use `Money` / `calculateLine` from `@erp/shared`. Amounts travel as strings and are stored as Decimal128.
- Dates: store UTC (`Date`), send ISO-8601 strings, display in `Asia/Riyadh`. Business dates without a time (invoice date) are stored at 00:00 UTC of that day. **[decision]** Confirm this in the sales module ADR.
- Percentages are strings in percent (`"15"` = 15%).

## Errors

- Throw `AppError` (status + code + message) for expected failures. Let unexpected errors bubble up to the central handler.
- Never swallow errors silently. If you catch, either handle the error meaningfully or re-throw.
- Error codes are stable API contract (`ERROR_CODES` in `@erp/shared`). Messages are for humans.

## Logging

- `getLogger()` (Pino), never `console.*`. Log structured context: `logger.warn({ clientId }, 'Credit limit exceeded')`.
- Never log secrets, tokens, passwords or full personal data.

## Internationalization

- No user-facing string literals in components. Use `t('key')`, and add the key to **both** `en` and `ar`.
- Layout must work in RTL. Use logical CSS properties, and Ant Design's direction support.

## Tests

- Test business rules with **unit tests**, using concrete numbers taken from real cases.
- Test API behavior **through HTTP** (Supertest), including 401, 403, 404 (cross-tenant) and 422 paths.
- Test UI the way users use it (roles and labels, not CSS selectors).
- Name tests after behavior: `it('rejects a duplicate email')`, not `it('test 3')`.

## Comments

- Explain _why_ (business rule, legal requirement, workaround), not _what_ the code obviously does.
- Link the doc or ADR for non-obvious rules (for example `// see docs/adr/0006-money-as-decimal.md`).
- Use `TODO(<github-username>): …` with an issue link for known gaps.
