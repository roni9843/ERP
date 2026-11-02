# Frontend architecture (`apps/web`)

React 19 · Vite · Ant Design 6 · React Router · TanStack Query · Zustand · React Hook Form + Zod · i18next.

## Folder structure

```
apps/web/src/
├── main.tsx                     # createRoot → <AppProviders><RouterProvider/></AppProviders>
├── app/                         # Application shell (not feature-specific)
│   ├── providers/AppProviders.tsx   # QueryClient, Ant Design ConfigProvider (theme, locale, RTL), AntD App
│   ├── router/                  # router.tsx (lazy routes), ProtectedRoute/GuestRoute, paths.ts
│   ├── layouts/                 # AppLayout (sidebar + header), AuthLayout, navigation.tsx, LanguageSwitch
│   └── pages/                   # NotFoundPage, RouteErrorPage
├── features/                    # One folder per business feature (see features/README.md)
│   ├── auth/                    # api.ts, LoginPage, SignupPage
│   ├── dashboard/
│   └── crm/clients/             # ★ Reference feature: api.ts, hooks.ts, ClientsPage, ClientFormModal
├── shared/                      # Reusable, feature-agnostic code
│   ├── api/                     # http (axios + interceptors), query-client, errors
│   ├── config/env.ts            # typed VITE_* variables
│   ├── i18n/                    # i18next setup, applyLocale(), locales/{en,ar}/common.json
│   ├── lib/format.ts            # money and date formatting (Intl, Asia/Riyadh)
│   └── ui/                      # PageHeader, FormField (RHF ↔ AntD Form.Item)
├── stores/                      # Zustand: auth.store (session, useCan), preferences.store (locale)
├── styles/global.css
└── test/                        # setup.ts (jsdom polyfills), render.tsx (renderRoute helper)
```

Import with the `@/` alias (`@/shared/api/http`). Shared contracts come from `@erp/shared`.

## State management: one tool per kind of state

| State             | Tool                                    | Examples                                        |
| ----------------- | --------------------------------------- | ----------------------------------------------- |
| Server data       | **TanStack Query**                      | client lists, invoices, the current user's data |
| Client / UI state | **Zustand**                             | session, language, sidebar                      |
| Form state        | **React Hook Form** + shared Zod schema | create or edit client                           |
| URL state         | **React Router**                        | current page, filters worth sharing             |

Never copy server data into Zustand. Mutations invalidate queries (`queryClient.invalidateQueries({ queryKey: clientKeys.all })`).

## Data fetching pattern

```
features/crm/clients/
├── api.ts      → typed functions over the shared `http` client (listClients, createClient, …)
├── hooks.ts    → query keys + useQuery / useMutation hooks (useClients, useCreateClient, …)
└── *.tsx       → components use the hooks, never axios directly
```

`http` adds `Authorization` and `Accept-Language` and clears the session on `401`. `getApiErrorMessage(error, fallback)` extracts the API's message for toasts and alerts.

## Forms

- `useForm({ resolver: zodResolver(sharedSchema) })`: **the same schema the API uses**, so client and server validation never disagree.
- Wrap the form in a native `<form noValidate onSubmit={handleSubmit(onValid)}>` and use `<Form layout="vertical" component={false}>` from Ant Design only for layout. `noValidate` stops the browser's own validation from blocking submission and showing untranslated messages.
- Use `FormField` for every input. It wires errors into `Form.Item` and links the label to the input (`htmlFor` / `id`) for accessibility.
- Optional text inputs map `""` to `undefined` in `onChange`, because the schemas reject empty formatted strings such as a VAT number.

## Routing

- Feature pages are **lazy routes** (`lazy: async () => ({ Component })`), one chunk per page.
- `ProtectedRoute` guards the app shell; `GuestRoute` guards `/login` and `/signup`.
- Use `paths.ts` constants. Never hard-code URLs.
- Adding a page: route in `router.tsx`, menu entry in `navigation.tsx` (with a `permission`), translations.

## Internationalization and RTL

- **Arabic is the default**; English is the alternative. `applyLocale()` updates i18next, `<html dir lang>`, the dayjs locale (date pickers) and Zod's built-in messages together.
- **No hard-coded UI strings.** Add keys to both `locales/en/common.json` and `locales/ar/common.json`; the i18n Ally VS Code extension shows missing keys.
- Ant Design mirrors its components in RTL through `ConfigProvider direction`. In your own styles use **logical properties** (`margin-inline-start`, `padding-inline`, `inset-inline-end`), not left and right.
- Wrap numbers that must stay left-to-right (amounts, codes, VAT and phone numbers) in `className="ltr-number"`, or put `dir="ltr"` on inputs.
- Amounts render with Latin digits (`ar-SA-u-nu-latn`) to match invoices and ZATCA documents.
- Validation messages: custom messages in shared schemas are currently English. **TODO:** switch them to i18n keys and translate them in `FormField`.

## Permissions in the UI

`useCan(PERMISSIONS.X)` hides buttons and menu items. This is **for UX only**: the API enforces every permission independently.

## Session (temporary)

The session is stored by Zustand `persist` in `localStorage` for development convenience. The target design keeps the access token **in memory only** and restores the session with an httpOnly refresh-token cookie ([security.md](security.md)).

## Testing

| Kind             | Tooling                          | Notes                                                                                                                                         |
| ---------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit / component | Vitest + Testing Library (jsdom) | `renderRoute(<Page/>, '/path')` renders inside the real providers; `test/setup.ts` polyfills `matchMedia` and `ResizeObserver` for Ant Design |
| End-to-end       | Playwright (`e2e/`)              | `pnpm exec playwright install chromium` once; `pnpm test:e2e` starts Vite                                                                     |

Query by role and label, as users do: `getByRole('button', { name: 'Log in' })`, `getByLabelText('Email')`. Test both languages for layout-critical screens.

## Checklist: adding a feature

1. `api.ts` with typed calls using `@erp/shared` DTOs.
2. `hooks.ts` with query keys and hooks.
3. Page and components, using `FormField` for inputs and `PageHeader` for titles.
4. Route, menu entry with permission, and translations in **en and ar**.
5. Tests: at least a render test and the main interaction, checked in RTL.
