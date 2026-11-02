# Architecture Decision Records

An ADR records one significant decision: the context, the decision and its consequences. ADRs are **immutable once accepted**. To change a decision, write a new ADR that supersedes the old one, and update the old one's status line.

| #                                                 | Decision                                                       | Status   |
| ------------------------------------------------- | -------------------------------------------------------------- | -------- |
| [0001](0001-record-architecture-decisions.md)     | Record architecture decisions                                  | Accepted |
| [0002](0002-monorepo-pnpm-turborepo.md)           | Monorepo with pnpm workspaces and Turborepo                    | Accepted |
| [0003](0003-express-modular-monolith.md)          | Express 5 modular monolith for the API                         | Accepted |
| [0004](0004-mongodb-with-transactions.md)         | MongoDB (Mongoose) as a replica set, with transactions         | Accepted |
| [0005](0005-shared-database-multi-tenancy.md)     | Shared-database multi-tenancy enforced by a Mongoose plugin    | Accepted |
| [0006](0006-money-as-decimal.md)                  | Money as decimals: strings in JSON, Decimal128 in MongoDB      | Accepted |
| [0007](0007-zod-shared-validation-and-openapi.md) | Zod schemas shared by API and web; OpenAPI generated from them | Accepted |
| [0008](0008-frontend-stack.md)                    | React + Ant Design (RTL) + TanStack Query + Zustand            | Accepted |
| [0009](0009-typescript-6.md)                      | Pin TypeScript 6.0 (not 7)                                     | Accepted |

Template: copy `0001`, then fill in Context / Decision / Consequences.
