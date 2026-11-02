# 0004. MongoDB (Mongoose) as a replica set, with transactions

- Status: Accepted
- Date: 2026-11-02

## Context

The team chose MongoDB with Mongoose. ERP data is relational in places (ledgers, stock), and postings must be all-or-nothing.

## Decision

- MongoDB **must run as a replica set** in every environment (a single-node set locally and in tests), because multi-document transactions require it.
- All-or-nothing work goes through `withTransaction()`. `transactionAsyncLocalStorage` makes every Mongoose call inside it join the transaction automatically.
- `strictQuery` is on. Collections and indexes are created at startup (`initModels()`), because creating a collection inside a transaction can fail.
- Tests use `mongodb-memory-server` (a replica set), so no Docker is needed for CI.

## Consequences

- Correct financial postings without manual compensation logic.
- Reporting-heavy queries need careful indexes and aggregation pipelines. Consider read models or materialized summaries for large reports.
- Developers must run a replica set locally (Docker Compose handles it).
