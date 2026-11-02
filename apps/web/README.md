# @erp/web

Web client of the ERP platform: React 19, Vite, Ant Design 6 (Arabic RTL / English), React Router, TanStack Query, Zustand, React Hook Form + Zod, i18next.

## Scripts

| Command                        | What it does                                              |
| ------------------------------ | --------------------------------------------------------- |
| `pnpm dev`                     | Vite dev server on http://localhost:5173                  |
| `pnpm build`                   | Production build to `dist/`                               |
| `pnpm preview`                 | Serve the production build locally                        |
| `pnpm test`                    | Vitest + Testing Library (jsdom)                          |
| `pnpm test:e2e`                | Playwright (`pnpm exec playwright install chromium` once) |
| `pnpm lint` / `pnpm typecheck` | ESLint / `tsc`                                            |

## Configuration

Copy `.env.example` to `.env`. `VITE_API_URL` points to the API (default `http://localhost:4000/api/v1`).

## Screens today

- `/login`, `/signup`: authentication (guest-only)
- `/`: dashboard placeholder
- `/crm/clients`: client list with search, pagination, create / edit modal, delete (permission-aware)
- Language switch (العربية / English) in the header; Arabic is the default and the whole UI mirrors to RTL.

## Structure

See [docs/architecture/frontend.md](../../docs/architecture/frontend.md). Start with the reference feature in `src/features/crm/clients`.
