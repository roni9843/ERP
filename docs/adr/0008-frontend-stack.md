# 0008. React + Ant Design (RTL) + TanStack Query + Zustand

- Status: Accepted
- Date: 2026-11-02

## Context

The product is data-heavy (tables, complex forms, trees, date ranges) and must be fully usable in Arabic (RTL) and English.

## Decision

- **React 19 + Vite** single-page app.
- **Ant Design 6**: enterprise components (Table, Form, DatePicker, Tree, …) with built-in RTL (`ConfigProvider direction`) and Arabic locale. Chosen over shadcn/ui + Tailwind (more assembly work for complex data UIs and RTL) and MUI (paid advanced grid).
- **TanStack Query** for server state, **Zustand** for client state, **React Hook Form + Zod** for forms, **React Router** (lazy routes), **i18next** for translations.

## Consequences

- Fast delivery of data screens with consistent UX in both directions.
- Ant Design's core adds about 170 kB gzip to the initial load; feature pages are lazy-loaded to compensate.
- The UI looks like Ant Design unless themed. Adjust design tokens in `AppProviders` for branding.
