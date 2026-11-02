# Start here: onboarding guide

Welcome! This guide takes you from a fresh clone to your first merged pull request. Plan for about a day of reading and setup.

## 1. What this project is (5 minutes)

A multi-tenant **SaaS ERP for Saudi small and medium businesses**: invoicing, inventory, purchasing, accounting, rentals, HR. It must be **ZATCA e-invoicing ready** and fully usable in **Arabic (RTL) and English**. Today the repository contains the full architecture, tooling and one complete reference feature (**CRM → Clients**). Every business module still has to be built on top of it.

Our first target customers are event companies that rent equipment and run printing jobs, so the rental module matters a lot.

## 2. Get it running (30 minutes)

Follow [getting-started.md](getting-started.md):

```bash
pnpm install
docker compose up -d
cp apps/api/.env.example apps/api/.env && cp apps/web/.env.example apps/web/.env
pnpm dev
```

Then:

1. Open http://localhost:5173. Sign up a test company, use the language switch (العربية ⇄ English) and create a few clients.
2. Open http://localhost:4000/api/docs. Call `POST /auth/login`, click **Authorize**, paste the token and try `GET /crm/clients`.
3. Run `pnpm check` (lint, typecheck and tests across the monorepo; all should pass).

## 3. Read in this order (about 2 to 3 hours)

| #   | Read                                                                                               | Why                                                                  |
| --- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 1   | [README.md](../README.md)                                                                          | Stack, layout, commands                                              |
| 2   | [architecture/overview.md](architecture/overview.md)                                               | The big picture and the request lifecycle                            |
| 3   | [CONTRIBUTING.md](../CONTRIBUTING.md) + [conventions/git-workflow.md](conventions/git-workflow.md) | How we branch, commit and review                                     |
| 4   | [architecture/backend.md](architecture/backend.md)                                                 | API layers and module anatomy                                        |
| 5   | [architecture/multi-tenancy.md](architecture/multi-tenancy.md)                                     | **The most important safety rule in the codebase**                   |
| 6   | [architecture/frontend.md](architecture/frontend.md)                                               | State management, forms, i18n and RTL                                |
| 7   | [domain/module-catalog.md](domain/module-catalog.md)                                               | What we will build, in which phase                                   |
| 8   | [domain/reference-rules.md](domain/reference-rules.md) + [domain/glossary.md](domain/glossary.md)  | The business rules (tax, posting, stock, rentals) and the vocabulary |
| 9   | [adr/README.md](adr/README.md)                                                                     | Why the main decisions were made                                     |

Skim [architecture/accounting-engine.md](architecture/accounting-engine.md), [compliance/zatca.md](compliance/zatca.md) and [architecture/security.md](architecture/security.md) now, and read them carefully before working on money, invoices or auth.

## 4. Walk through the code (about 1 hour)

Trace one request end to end, creating a client:

**Shared contract**

1. `packages/shared/src/schemas/crm/client.ts`: the Zod schemas and DTOs both sides use.

**API** 2. `apps/api/src/app.ts`: the middleware chain. 3. `apps/api/src/modules/crm/clients/client.routes.ts`, then `client.controller.ts`, then `client.service.ts`, then `client.model.ts`. 4. `apps/api/src/core/database/plugins/tenant-scope.plugin.ts`: how tenant isolation is enforced. 5. `apps/api/src/modules/crm/clients/__tests__/clients.routes.test.ts`: the tests that describe the behavior.

**Web** 6. `apps/web/src/features/crm/clients/`: `api.ts`, then `hooks.ts`, then `ClientsPage.tsx` / `ClientFormModal.tsx`.

**Money math** 7. `packages/shared/src/tax/line-calculator.ts` and its tests: VAT and discount math with real examples.

## 5. Your first tasks (suggested)

Pick one to learn the workflow, open a draft PR early, and ask questions in the PR:

- **Warm-up:** add a "Contacts" sub-list to clients (API + UI), following the clients module exactly.
- **Foundation:** start the `settings` module: company profile with National Address, VAT number and base currency.
- **Foundation:** refresh tokens (rotating, httpOnly cookie), as designed in [security.md](architecture/security.md).

Before each PR: `pnpm check`, translations in **en and ar**, a look at the UI in RTL, and the PR template filled in.

## 6. Working together

- The two of us work in different time zones (Bangladesh and the US). Write PR descriptions and issue comments so they can be understood without a call.
- Record decisions in an ADR ([adr/](adr/README.md)), not only in chat.
- Business-rule questions (Saudi VAT, ZATCA, how rentals are priced): check [domain/reference-rules.md](domain/reference-rules.md) first, then ask in the issue.
