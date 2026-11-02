# Documentation

| Area         | Document                                                               | Read it when…                                               |
| ------------ | ---------------------------------------------------------------------- | ----------------------------------------------------------- |
| Onboarding   | [onboarding.md](onboarding.md)                                         | You are new: reading order, code walkthrough, first tasks   |
| Setup        | [getting-started.md](getting-started.md)                               | You set up the project for the first time                   |
| Architecture | [architecture/overview.md](architecture/overview.md)                   | You want the big picture                                    |
|              | [architecture/backend.md](architecture/backend.md)                     | You work on `apps/api`                                      |
|              | [architecture/frontend.md](architecture/frontend.md)                   | You work on `apps/web`                                      |
|              | [architecture/multi-tenancy.md](architecture/multi-tenancy.md)         | You touch data access or add a model                        |
|              | [architecture/accounting-engine.md](architecture/accounting-engine.md) | You work on anything that moves money or stock              |
|              | [architecture/security.md](architecture/security.md)                   | You work on auth, permissions or sensitive data             |
| Decisions    | [adr/README.md](adr/README.md)                                         | You wonder why something is the way it is                   |
| Domain       | [domain/module-catalog.md](domain/module-catalog.md)                   | You plan or scope a module                                  |
|              | [domain/reference-rules.md](domain/reference-rules.md)                 | You implement business rules (tax, posting, stock, rentals) |
|              | [domain/glossary.md](domain/glossary.md)                               | You meet an ERP or Saudi-specific term (EN/AR)              |
| Compliance   | [compliance/zatca.md](compliance/zatca.md)                             | You work on invoices, credit or debit notes, e-invoicing    |
| Conventions  | [conventions/coding-standards.md](conventions/coding-standards.md)     | Always                                                      |
|              | [conventions/api-guidelines.md](conventions/api-guidelines.md)         | You add or change endpoints                                 |
|              | [conventions/git-workflow.md](conventions/git-workflow.md)             | You branch, commit or open a PR                             |

Docs are part of the code. Update them in the same PR as the change they describe.
