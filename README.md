# ERP Platform

A multi-tenant **SaaS ERP for small and medium businesses in Saudi Arabia**: sales and invoicing, inventory, purchasing, accounting, rentals, HR and payroll. It is built to be **ZATCA e-invoicing ready** and works in **Arabic (RTL) and English**.

> Status: **early scaffolding**. The architecture, tooling and one reference module (CRM → Clients) are in place. The business modules are planned in [docs/domain/module-catalog.md](docs/domain/module-catalog.md).
>
> **New to the project? Start with [docs/onboarding.md](docs/onboarding.md).**

## Tech stack

| Layer     | Choice                                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------------------ |
| Monorepo  | pnpm workspaces + Turborepo                                                                                  |
| Language  | TypeScript (strict) everywhere                                                                               |
| API       | Node.js 24, Express 5, Mongoose 9 (MongoDB replica set), Zod 4, JWT (jose), argon2, Pino, OpenAPI via Scalar |
| Web       | React 19, Vite, Ant Design 6 (RTL), React Router, TanStack Query, Zustand, React Hook Form, i18next          |
| Shared    | Zod schemas, DTO types, permission catalog, decimal-safe money and VAT math (`@erp/shared`)                  |
| Testing   | Vitest, Supertest + mongodb-memory-server, Testing Library, Playwright                                       |
| Quality   | ESLint (flat, type-aware), Prettier, Husky + lint-staged, Commitlint (Conventional Commits)                  |
| Local dev | Docker Compose: MongoDB (replica set), Redis, Mailpit, MinIO                                                 |
| CI        | GitHub Actions (lint, typecheck, test, build)                                                                |

## Repository layout

```
.
├── apps/
│   ├── api/                 # Express 5 + Mongoose REST API (modular monolith)
│   └── web/                 # React + Vite + Ant Design single-page app
├── packages/
│   ├── shared/              # Zod schemas, types, permissions, money and VAT math (used by api and web)
│   ├── eslint-config/       # Shared ESLint flat configs (base / node / react)
│   └── typescript-config/   # Shared tsconfig presets
├── docs/                    # Architecture, ADRs, domain reference, conventions, ZATCA notes
├── infra/                   # Local infrastructure helpers
├── .github/                 # CI workflow, PR and issue templates, Dependabot
├── docker-compose.yml       # MongoDB (replica set), Redis, Mailpit, MinIO for local development
└── turbo.json               # Task pipeline (build, dev, lint, typecheck, test)
```

## Quick start

Prerequisites: **Node.js 24** (`nvm use`), **pnpm 12** (`corepack enable` or `npm i -g pnpm`) and **Docker** (optional but recommended).

```bash
pnpm install

# 1. Local infrastructure (MongoDB replica set, Redis, Mailpit, MinIO)
docker compose up -d

# 2. Environment files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 3. Run API + web in watch mode
pnpm dev
```

| Service          | URL                                    |
| ---------------- | -------------------------------------- |
| Web app          | http://localhost:5173                  |
| API              | http://localhost:4000/api/v1           |
| API reference    | http://localhost:4000/api/docs         |
| OpenAPI JSON     | http://localhost:4000/api/openapi.json |
| Mailpit (emails) | http://localhost:8025                  |
| MinIO console    | http://localhost:9001                  |

No Docker? See [docs/getting-started.md](docs/getting-started.md#running-without-docker) for MongoDB Atlas or a local `mongod`. The test suites do **not** need Docker, because they start an in-memory MongoDB.

## Everyday commands

| Command                        | What it does                                          |
| ------------------------------ | ----------------------------------------------------- |
| `pnpm dev`                     | Run every app in watch mode                           |
| `pnpm build`                   | Build every app and package                           |
| `pnpm check`                   | Lint, typecheck and test everything (run before a PR) |
| `pnpm lint` / `pnpm typecheck` | Lint or typecheck everything                          |
| `pnpm test`                    | Run every unit and integration test suite             |
| `pnpm format`                  | Format the repository with Prettier                   |
| `pnpm --filter @erp/api test`  | Run one workspace's task                              |

## Documentation

Start with [docs/README.md](docs/README.md). Key documents:

- [Getting started](docs/getting-started.md): full local setup and troubleshooting
- [Architecture overview](docs/architecture/overview.md), [backend](docs/architecture/backend.md), [frontend](docs/architecture/frontend.md)
- [Multi-tenancy](docs/architecture/multi-tenancy.md), [accounting engine](docs/architecture/accounting-engine.md), [security](docs/architecture/security.md)
- [Module catalog](docs/domain/module-catalog.md), [business rules reference](docs/domain/reference-rules.md), [glossary (EN/AR)](docs/domain/glossary.md)
- [ZATCA e-invoicing](docs/compliance/zatca.md)
- [Architecture Decision Records](docs/adr/README.md)
- [Contributing](CONTRIBUTING.md): workflow, commits, PRs, how to add a module

## License

Proprietary. All rights reserved.
