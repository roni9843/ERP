# 0009. Pin TypeScript 6.0 (not 7)

- Status: Accepted
- Date: 2026-11-02

## Context

TypeScript 7 (the native Go compiler) is the latest major version. However, `typescript-eslint` 8.x, which powers our type-aware lint rules, supports TypeScript `>=4.8.4 <6.1.0`.

## Decision

Pin `typescript@~6.0.3` in every workspace. Configs avoid options deprecated for 7.0 (no `baseUrl`, `moduleResolution: Bundler`, explicit `types`), so upgrading later is cheap.

## Consequences

- Type-aware linting works today.
- Revisit when `typescript-eslint` supports TypeScript 7. Upgrade in one PR across the monorepo, and supersede this ADR.
