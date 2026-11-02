# Security

## Authentication

| Aspect              | Today                                                                                                                              | Planned                                                                                                                                 |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Passwords           | argon2id (`@node-rs/argon2`), constant-time path for unknown emails                                                                | Password reset by email, optional 2FA (TOTP)                                                                                            |
| Access token        | JWT HS256 via `jose`; claims `sub` (user), `tid` (tenant), `role`; issuer and audience checked; TTL `JWT_ACCESS_TTL` (default 15m) | Asymmetric keys (EdDSA) with rotation                                                                                                   |
| Session renewal     | none: log in again when the token expires                                                                                          | **Rotating refresh tokens** in an httpOnly, Secure, SameSite cookie; stored hashed with a family id; reuse detection revokes the family |
| Token storage (web) | localStorage (**temporary**, development only)                                                                                     | Access token in memory only; refresh cookie restores the session                                                                        |
| Brute force         | `express-rate-limit` on `/auth/*` (20 per 15 min per IP)                                                                           | Per-account lockout with backoff                                                                                                        |

## Authorization

- **Permission catalog** in `@erp/shared` (`<module>.<resource>.<action>`), mapped to roles (`owner`, `admin`, `staff`). Routes declare `authorize(PERMISSIONS.X)`.
- Planned: **tenant-defined roles** stored in the database, and **scoped permissions**:
  - `.all`: every record
  - `.own`: records the user created (`createdBy`)
  - `.assigned`: records assigned to the user (for example clients assigned to a salesperson)
- Services will apply scope filters in addition to the tenant filter.
- The UI hides what a user cannot do (`useCan`), but **the API is the only authority**.

## Tenant isolation

See [multi-tenancy.md](multi-tenancy.md). It is enforced by the tenant-scope plugin (fail closed) and covered by tests in every module.

## Input and output

- Every input is validated with Zod schemas (body, query, params). Unknown filter fields are rejected (`strictQuery`). Regex search input is escaped (`escapeRegex`).
- Responses are explicit DTOs, never raw documents (no `passwordHash`, `tenantId` or `__v`).
- Errors never leak stack traces. Unknown errors become a generic `500` with a request id; details go to the logs.

## Transport and headers

- `helmet` sets security headers (a strict CSP everywhere except the API reference page).
- CORS allows only `CORS_ORIGINS`, with credentials.
- `x-powered-by` is disabled. HTTPS terminates at the load balancer, so `trust proxy` is set.

## Secrets and configuration

- Secrets come from environment variables, validated at startup. `.env` files are git-ignored; commit only `.env.example`.
- Production secrets live in the platform's secret manager. Rotate `JWT_ACCESS_SECRET` with a key-id (kid) scheme once asymmetric keys land.
- Logs redact `authorization`, `cookie`, `password`, `passwordHash` and `accessToken`.

## Auditing

- `createdBy` and `updatedBy` plus timestamps on business documents.
- Planned: an **activity log** (who did what, when, from which IP, before and after for sensitive fields), viewable per document and per user.

## Saudi compliance notes

- **PDPL (Personal Data Protection Law)**: lawful basis and purpose for personal data, data subject rights (access, correction, deletion), breach notification, and restrictions on transferring personal data outside the Kingdom. Plan the hosting region and the tenant export/deletion flows accordingly.
- **ZATCA**: e-invoice cryptographic keys (private keys and CSIDs) are highly sensitive. Store them encrypted (KMS or envelope encryption), per tenant and device, never in logs. See [compliance/zatca.md](../compliance/zatca.md).
- **NCA controls**: government and regulated customers may require alignment with the National Cybersecurity Authority's controls. Track this as a sales requirement.

## Checklist for every PR touching security-sensitive code

- [ ] Inputs validated with shared schemas; no `any` reaching the database
- [ ] No tenant opt-out (`skipTenantScope`) without a reviewed reason
- [ ] Permission guard on every new route
- [ ] No secrets or personal data in logs
- [ ] Tests for unauthorized (401), forbidden (403) and cross-tenant (404) paths
