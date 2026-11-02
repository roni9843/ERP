# 0001. Record architecture decisions

- Status: Accepted
- Date: 2026-11-02

## Context

Two developers in different time zones (Bangladesh and the United States) build this product together. Decisions made in chat are lost; new contributors repeat old debates.

## Decision

Record significant technical decisions as short Markdown ADRs in `docs/adr`, numbered sequentially. "Significant" means hard to reverse, or affecting more than one module or both apps.

## Consequences

- Reviews can point to the ADR instead of re-arguing.
- Every PR that changes an accepted decision must add a superseding ADR.
