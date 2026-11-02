# Getting started

## 1. Prerequisites

| Tool    | Version | Notes                                                                          |
| ------- | ------- | ------------------------------------------------------------------------------ |
| Node.js | 24 LTS  | `.nvmrc` pins it; run `nvm use` (or `fnm use`)                                 |
| pnpm    | 12      | `corepack enable`, or `npm i -g pnpm`; the version is pinned in `package.json` |
| Docker  | recent  | Optional. Runs MongoDB, Redis, Mailpit and MinIO locally                       |
| Git     | 2.30+   | Line endings are normalized to LF by `.gitattributes`                          |

Recommended VS Code extensions are listed in `.vscode/extensions.json`. VS Code suggests them when you open the folder.

## 2. Install

```bash
git clone <repo-url> erp-platform && cd erp-platform
pnpm install          # also installs the Git hooks (husky)
```

## 3. Start local infrastructure

```bash
docker compose up -d
docker compose ps     # mongo should become "healthy" (the replica set is initiated automatically)
```

| Service | Port(s)                  | Why we need it                                                                                           |
| ------- | ------------------------ | -------------------------------------------------------------------------------------------------------- |
| MongoDB | 27017                    | Primary database. Runs as a **single-node replica set**, because multi-document transactions require one |
| Redis   | 6379                     | Background jobs (BullMQ) and caching (planned)                                                           |
| Mailpit | 1025 (SMTP), 8025 (UI)   | Catches outgoing emails in development                                                                   |
| MinIO   | 9000 (S3 API), 9001 (UI) | S3-compatible storage for attachments (planned)                                                          |

## 4. Configure environment variables

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

The API validates its environment at startup (`apps/api/src/config/env.ts`). A missing or invalid variable stops the process with a clear message. Change `JWT_ACCESS_SECRET` to a long random string:

```bash
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
```

## 5. Run

```bash
pnpm dev
```

- Web: http://localhost:5173. Create an account on the sign-up page, then you land on the dashboard.
- API reference: http://localhost:4000/api/docs. You can try requests here; click **Authorize** and paste the access token you get from sign-up or login.
- Health check: http://localhost:4000/api/v1/health

## 6. Test

```bash
pnpm test                         # all workspaces
pnpm --filter @erp/api test       # API only (starts an in-memory MongoDB replica set)
pnpm --filter @erp/web test:e2e   # Playwright (run `pnpm exec playwright install` once first)
```

The first API test run downloads a MongoDB binary (around 100 MB), which is cached afterwards.

## Running without Docker

You need a MongoDB **replica set**, because the code uses transactions. Pick one:

- **MongoDB Atlas (free M0 cluster).** Atlas clusters are replica sets already. Put the connection string in `MONGODB_URI`.
- **A local `mongod`.** Start it with `mongod --replSet rs0 --dbpath <dir>`, run `mongosh --eval "rs.initiate()"` once, then use
  `MONGODB_URI=mongodb://localhost:27017/erp?replicaSet=rs0&directConnection=true`.

Redis, Mailpit and MinIO are not required until the features that use them land.

## Troubleshooting

| Symptom                                                                  | Fix                                                                                                   |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `Transaction numbers are only allowed on a replica set member or mongos` | Your MongoDB is not a replica set. See above.                                                         |
| API exits with `Invalid environment variables`                           | Compare `apps/api/.env` with `.env.example`; the error lists the offending keys.                      |
| Git shows every line changed on Windows                                  | Run `git config core.autocrlf false` and re-checkout; `.gitattributes` enforces LF.                   |
| Husky hooks do not run                                                   | Run `pnpm install` again (the `prepare` script installs them), and check `git config core.hooksPath`. |
| Playwright cannot find a browser                                         | Run `pnpm --filter @erp/web exec playwright install chromium`.                                        |
