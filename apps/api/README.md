# @erp/api

REST API of the ERP platform: Express 5, Mongoose 9, Zod 4, TypeScript (ESM).

## Scripts

| Command                        | What it does                                                |
| ------------------------------ | ----------------------------------------------------------- |
| `pnpm dev`                     | Watch mode with `tsx` (loads `.env`)                        |
| `pnpm build`                   | Bundle to `dist/` with tsup (`@erp/shared` is bundled in)   |
| `pnpm start`                   | Run the production bundle (`node dist/main.js`)             |
| `pnpm test`                    | Vitest + Supertest against an in-memory MongoDB replica set |
| `pnpm lint` / `pnpm typecheck` | ESLint (type-aware) / `tsc --noEmit`                        |

## Configuration

Copy `.env.example` to `.env`. Variables are validated at startup in `src/config/env.ts`.

## Endpoints today

| Method           | Path                             | Notes                                                |
| ---------------- | -------------------------------- | ---------------------------------------------------- |
| GET              | `/api/v1/health`                 | Liveness and database status                         |
| POST             | `/api/v1/auth/signup`            | Create a company and its owner, and return a session |
| POST             | `/api/v1/auth/login`             | Email + password, returns a session                  |
| GET              | `/api/v1/auth/me`                | Current user and tenant                              |
| GET/POST         | `/api/v1/crm/clients`            | List (paginated, search, sort) / create              |
| GET/PATCH/DELETE | `/api/v1/crm/clients/:id`        | Read / update / delete                               |
| GET              | `/api/openapi.json`, `/api/docs` | OpenAPI 3.1 document, Scalar API reference           |

## Structure

See [docs/architecture/backend.md](../../docs/architecture/backend.md). Start with the reference module in `src/modules/crm/clients`.
