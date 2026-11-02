# 0002. Monorepo with pnpm workspaces and Turborepo

- Status: Accepted
- Date: 2026-11-02

## Context

The API and the web app share validation rules, DTO types, permission names and tax math. Keeping them in sync across two repositories is error-prone.

## Decision

One repository with pnpm workspaces (`apps/*`, `packages/*`) and Turborepo for task orchestration and caching. Shared code lives in `packages/shared`, consumed as TypeScript source. Shared tooling lives in `packages/eslint-config` and `packages/typescript-config`.

## Consequences

- One PR can change the contract and both sides atomically.
- `turbo run lint typecheck test build` runs everything in dependency order, with caching.
- pnpm's strict dependency isolation prevents relying on undeclared packages. Each workspace lists what it uses.
- Native build scripts must be explicitly allowed (`allowBuilds` in `pnpm-workspace.yaml`).
