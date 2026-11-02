## What and why

<!-- What does this PR change, and why? Link the issue: Closes #123 -->

## How to test

<!-- Steps a reviewer can follow, or the tests that cover it. -->

## Checklist

- [ ] `pnpm check` passes locally (lint, typecheck, tests)
- [ ] Tests added or updated (business rules such as tax, money, posting and stock have unit tests)
- [ ] Tenant isolation preserved (tenant models use `tenantScopePlugin`; no unscoped queries)
- [ ] UI strings translated in **en** and **ar**, and the screen checked in RTL
- [ ] OpenAPI paths updated for endpoint changes
- [ ] Docs / ADR updated if architecture or conventions changed

## Screenshots (UI changes)

<!-- Before / after, in Arabic (RTL) and English (LTR). -->
