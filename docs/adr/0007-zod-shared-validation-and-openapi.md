# 0007. Zod schemas shared by API and web; OpenAPI generated from them

- Status: Accepted
- Date: 2026-11-02

## Context

Validation rules (Saudi VAT number format, National Address, required fields) must be identical in forms and on the server, and the API docs must not drift from the code.

## Decision

- Request schemas and DTO schemas live in `@erp/shared` (Zod 4). The API parses with them in controllers; the web uses them through `zodResolver` in React Hook Form.
- The OpenAPI 3.1 document is generated from the same schemas with `@asteasolutions/zod-to-openapi`. Reusable components come from **Zod-native metadata** (`.meta({ id: 'Client' })`), so `@erp/shared` stays free of OpenAPI dependencies.
- We do **not** use `extendZodWithOpenApi` / `.openapi()`. Zod 4 copies methods onto schemas when they are created, so the extension would have to run before `@erp/shared` loads, which is fragile.

## Consequences

- One source of truth for validation, types and docs.
- Custom validation messages are currently English. Translating them needs i18n keys (see [frontend.md](../architecture/frontend.md)).
