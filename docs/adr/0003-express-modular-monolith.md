# 0003. Express 5 modular monolith for the API

- Status: Accepted
- Date: 2026-11-02

## Context

We need a Node.js + TypeScript API. NestJS, Express and Fastify were considered. The team chose Express for its simplicity and familiarity. ERP operations need atomic, cross-module transactions (an invoice also writes stock and journal entries).

## Decision

- **Express 5** (native async error handling) organized as a **modular monolith**: `src/core` for framework code, and `src/modules/<area>/<feature>` for features with a fixed anatomy (model → service → controller → routes → openapi → index).
- Express gives no structure by itself, so we enforce conventions: layering rules ([backend.md](../architecture/backend.md)), the `AppModule` contract, and a reference module (`crm/clients`) to copy.
- Modules call each other's **services**, not models. Cross-module side effects will use an in-process event bus.

## Consequences

- Simple deployment, one database, real transactions.
- Discipline is needed to keep boundaries. Code review enforces the layering rules.
- A module can be extracted into a service later if scale or team size demands it.
