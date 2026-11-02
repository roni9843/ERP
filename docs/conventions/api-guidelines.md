# API guidelines

## Basics

- Base path `/api/v1`. Breaking changes need a new version prefix; additive changes do not.
- JSON only, `camelCase` fields, UTF-8.
- Resource paths are plural nouns grouped by module: `/crm/clients`, `/sales/invoices`, `/inventory/products`.
- IDs are MongoDB ObjectIds as 24-character hex strings. Human-readable numbers (`code`, `number`) are separate fields.

## Methods and status codes

| Action         | Method & path                                                   | Success                            |
| -------------- | --------------------------------------------------------------- | ---------------------------------- |
| List           | `GET /things?page=1&limit=20&search=&sort=-createdAt`           | `200` with the pagination envelope |
| Read           | `GET /things/:id`                                               | `200`                              |
| Create         | `POST /things`                                                  | `201` + `Location` header + body   |
| Partial update | `PATCH /things/:id`                                             | `200` + body                       |
| Delete         | `DELETE /things/:id`                                            | `204`                              |
| State change   | `POST /things/:id/<verb>` (e.g. `/invoices/:id/issue`, `/void`) | `200` + body                       |

Use explicit action endpoints for workflow transitions (issue, approve, post, void). Never let a generic `PATCH` change a status that has accounting effects.

## Pagination envelope

```json
{ "items": [ … ], "page": 1, "limit": 20, "total": 134, "totalPages": 7 }
```

`limit` is at most 100. `sort` takes a field name, prefixed with `-` for descending order, from a whitelist per resource.

## Errors

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "path": "vatNumber",
        "message": "VAT number must be 15 digits, starting and ending with 3",
        "code": "invalid_format"
      }
    ],
    "requestId": "8f0c…"
  }
}
```

| Status | `code`                             | When                                                          |
| ------ | ---------------------------------- | ------------------------------------------------------------- |
| 400    | `INVALID_JSON`, `VALIDATION_ERROR` | Malformed body, invalid id format                             |
| 401    | `UNAUTHORIZED`                     | Missing, invalid or expired token                             |
| 403    | `FORBIDDEN`                        | Authenticated but lacks the permission                        |
| 404    | `NOT_FOUND`                        | Missing **or belongs to another tenant** (never reveal which) |
| 409    | `CONFLICT`, `EMAIL_TAKEN`          | Unique constraint, state conflict                             |
| 422    | `VALIDATION_ERROR`                 | Body or query failed the Zod schema (field-level `details`)   |
| 429    | `RATE_LIMITED`                     | Too many attempts                                             |
| 500    | `INTERNAL_ERROR`                   | Bug; check the logs by `requestId`                            |

## Data types

| Kind                     | JSON representation                            |
| ------------------------ | ---------------------------------------------- |
| Money, quantities, rates | decimal **string**: `"1250.50"`, `"15"`        |
| Date-time                | ISO-8601 UTC: `"2026-11-02T15:31:09.246Z"`     |
| Enums                    | lowercase strings from `@erp/shared` constants |
| Optional fields          | omitted when empty (not `null`)                |

## Headers

- `Authorization: Bearer <access token>`
- `Accept-Language: ar | en`, for localized messages (planned) and document rendering.
- `x-request-id`: optional on requests, always echoed in responses.
- Planned: `Idempotency-Key` on POSTs that create financial documents or payments, so client retries never double-post.

## Documentation

Every route is registered in its module's `<entity>.openapi.ts` with the same Zod schemas used for validation. Check `/api/docs` before opening a PR that changes endpoints.
