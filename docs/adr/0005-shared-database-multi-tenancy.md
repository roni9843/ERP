# 0005. Shared-database multi-tenancy enforced by a Mongoose plugin

- Status: Accepted
- Date: 2026-11-02

## Context

A SaaS for thousands of small companies. A database per tenant multiplies operational cost (migrations, indexes, connections). A shared database risks cross-tenant leaks if a developer forgets a filter.

## Decision

Shared database and collections, with a `tenantId` on every tenant document. `tenantScopePlugin` adds the tenant filter to every query and aggregation, stamps new documents, and **throws when no tenant is in the request context** (fail closed). Opting out (`skipTenantScope`) is explicit and reviewed. Every module ships a cross-tenant isolation test.

## Consequences

- Low operational cost, easy cross-tenant analytics for the platform.
- Isolation relies on the plugin. Operations it cannot scope (`bulkWrite`, `estimatedDocumentCount`) are banned on tenant models.
- The path to a dedicated database per large tenant stays open, because `tenantId` is everywhere.
- Details: [multi-tenancy.md](../architecture/multi-tenancy.md).
