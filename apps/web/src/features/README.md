# Features

One folder per business feature, mirroring the API modules (`crm/clients` ↔ `/api/v1/crm/clients`).

```
features/<area>/<feature>/
├── api.ts            # typed calls through @/shared/api/http, using @erp/shared DTOs
├── hooks.ts          # query keys + TanStack Query hooks
├── <Feature>Page.tsx # route component (lazy-loaded from app/router/router.tsx)
├── <Thing>FormModal.tsx / components…
└── *.test.tsx        # Testing Library tests
```

Rules:

- Features may import from `@/shared`, `@/stores` and `@erp/shared`, but **not from other features** (move shared pieces to `@/shared`).
- Components never call axios directly; they use the feature's hooks.
- Every string is translated (`t('…')`) in both `en` and `ar`.
- Reference implementation: [`crm/clients`](crm/clients).
