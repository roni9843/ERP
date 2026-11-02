# Git workflow

## Branching (GitHub Flow)

- `main` is always releasable and **protected**: no direct pushes, PR plus one approval, and green CI required.
- Work on short-lived branches off `main`:

| Prefix   | Use                                              |
| -------- | ------------------------------------------------ |
| `feat/`  | New functionality: `feat/api-invoice-issue`      |
| `fix/`   | Bug fix: `fix/web-rtl-table-actions`             |
| `chore/` | Tooling, deps, refactors without behavior change |
| `docs/`  | Documentation only                               |

- Rebase on `main` frequently (`git pull --rebase origin main`) to avoid big conflicts.

## Commits: Conventional Commits

```
<type>(<scope>): <summary in imperative mood>

[optional body: why, not what]

[optional footer: Closes #123, BREAKING CHANGE: …]
```

- Types: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `chore`, `ci`, `build`, `style`, `revert`
- Scopes: `api`, `web`, `shared`, `config`, `docs`, `infra`, `ci`, `deps`
- Examples:
  - `feat(api): add tenant-scoped sequence numbers`
  - `fix(web): keep VAT numbers left-to-right in RTL tables`

`commitlint` checks the message in the `commit-msg` hook; `lint-staged` formats staged files in `pre-commit`.

## Pull requests

- Small and focused (aim for under ~400 changed lines). Split refactors from behavior changes.
- Fill in the template: what and why, how to test, checklist, screenshots in **Arabic and English** for UI.
- Reviewers check correctness, tenant isolation, permissions, money handling, tests and translations.
- **Squash-merge** with a Conventional Commit title. Delete the branch after merging.

## Working across time zones (Bangladesh ⇄ United States)

- Write PR descriptions and issue comments so they can be understood without a call.
- Record decisions in ADRs, not only in chat.
- Leave a short end-of-day note on in-progress PRs: status, blockers, next step.
- Use draft PRs for early feedback.

## Releases (later)

Tag releases from `main` (`v0.x.y`). Generate the changelog from Conventional Commits. Deploy from tags.
