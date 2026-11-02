# Contributing

This document explains how we work together on this repository. The detailed rules live in [docs/conventions](docs/conventions); this page is the short version.

## Workflow (GitHub Flow)

1. Pick or open an issue. Every change should map to an issue.
2. Branch from an up-to-date `main`:
   `feat/<scope>-<short-description>`, `fix/<scope>-<short-description>`, `chore/...`, `docs/...`
   Example: `feat/api-clients-search`.
3. Commit using **Conventional Commits** (enforced by commitlint):
   `feat(api): add client search by VAT number`
   Scopes: `api`, `web`, `shared`, `config`, `docs`, `infra`, `ci`, `deps`.
4. Run `pnpm check` locally (lint + typecheck + tests).
5. Open a pull request using the template. Keep PRs small, ideally under ~400 changed lines.
6. Get at least **one approving review**, then **squash-merge**. CI must be green.

See [docs/conventions/git-workflow.md](docs/conventions/git-workflow.md).

## Definition of done

- [ ] Code follows [coding standards](docs/conventions/coding-standards.md) and [API guidelines](docs/conventions/api-guidelines.md).
- [ ] New behavior is covered by tests. Business rules (tax, money, posting, stock) **must** have unit tests.
- [ ] Tenant isolation is preserved: tenant-scoped models use the tenant plugin, with no unscoped queries.
- [ ] Every user-facing string is translated in **both** `en` and `ar`, and the screen works in RTL.
- [ ] OpenAPI docs are updated when endpoints change.
- [ ] Docs and ADRs are updated when architecture or conventions change.

## Adding a backend module

Follow the reference implementation in `apps/api/src/modules/crm/clients`.

1. Put the Zod schemas and DTO types the web app needs in `packages/shared/src/schemas/<area>/`.
2. Create `apps/api/src/modules/<area>/<feature>/` with these files:
   - `<entity>.model.ts`: Mongoose schema. Apply `tenantScopePlugin` for tenant data.
   - `<entity>.service.ts`: business logic. No Express types here.
   - `<entity>.controller.ts`: parses input with the shared schemas, calls the service, shapes the response.
   - `<entity>.routes.ts`: the Express router, with `authorize(...)` on each route.
   - `<entity>.openapi.ts`: registers the paths in the OpenAPI registry.
   - `index.ts`: exports the `AppModule` definition.
   - `__tests__/`: integration tests through HTTP, plus unit tests for pure logic.
3. Add the permissions to `packages/shared/src/permissions/catalog.ts`.
4. Register the module in `apps/api/src/modules/index.ts`.

Details: [docs/architecture/backend.md](docs/architecture/backend.md).

## Adding a frontend feature

Follow `apps/web/src/features/crm/clients`.

1. `api.ts`: typed API calls that use the shared DTO types.
2. `hooks.ts`: TanStack Query hooks (queries and mutations).
3. Components and pages inside the feature folder.
4. Add the route in `src/app/router/router.tsx` and the menu entry in `src/app/layouts/navigation.tsx`.
5. Add translation keys to `src/shared/i18n/locales/{en,ar}/*.json`.

Details: [docs/architecture/frontend.md](docs/architecture/frontend.md).

## Architecture Decision Records

Significant decisions are recorded in [docs/adr](docs/adr/README.md). If your change alters one, add a new ADR and link it in the PR. Do not rewrite accepted ADRs; supersede them.
