# @erp/shared

Code shared by `@erp/api` and `@erp/web`. It must stay **framework-free**: only `zod` and `decimal.js`.

| Folder         | Contents                                                                                                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `schemas/`     | Zod schemas for requests and DTOs (`clientCreateSchema`, `clientDtoSchema`, `loginSchema`, …). Response DTOs carry `.meta({ id })` so the API can publish them as OpenAPI components |
| `permissions/` | Permission catalog (`PERMISSIONS`), system roles, `roleHasPermission()`                                                                                                              |
| `money/`       | `Money` (decimal.js, ROUND_HALF_UP), `roundMoney`, `formatDecimal`, `DECIMAL_STRING_REGEX`                                                                                           |
| `tax/`         | `calculateLine()` and `summarizeLines()`: discount, inclusive / exclusive VAT, withholding, per-line rounding                                                                        |
| `constants/`   | Currencies (minor units), KSA VAT rate, max taxes per line                                                                                                                           |
| `types/`       | API error envelope, `Paginated<T>`, error codes                                                                                                                                      |

It is an **internal package**: `exports` point to TypeScript sources. Vite compiles it for the web app; tsup bundles it into the API build.

```bash
pnpm --filter @erp/shared test   # tax and money unit tests
```
