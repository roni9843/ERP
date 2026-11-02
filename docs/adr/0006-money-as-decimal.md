# 0006. Money as decimals: strings in JSON, Decimal128 in MongoDB

- Status: Accepted
- Date: 2026-11-02

## Context

Binary floating point cannot represent most decimal amounts (`0.1 + 0.2 = 0.30000000000000004`). VAT, discounts and ledgers must be exact. ZATCA validates totals.

## Decision

- **API / JSON**: amounts and quantities are decimal **strings** (`"1250.50"`), validated by `decimalStringSchema` (up to 4 decimals).
- **MongoDB**: `Decimal128`.
- **Code**: `Money` (a `decimal.js` clone with ROUND_HALF_UP) from `@erp/shared`. Never use `number` arithmetic for money.
- **Rounding**: half-up to the currency's minor units (2 for SAR, 3 for KWD/BHD/OMR), **at the line level**. Document totals are sums of rounded lines.
- **Tax math** (`calculateLine`): discount before tax; a fixed discount is per unit; inclusive taxes are extracted as `amount × r / (100 + Σr)` with net = amount − taxes (no drift); exclusive taxes apply to the same net (no compounding); a negative rate models withholding.

## Consequences

- Exact, reproducible totals on API, UI and printed documents.
- The UI must format, not compute (`formatMoney`).
- Reports that aggregate amounts must use `$sum` on Decimal128 (MongoDB keeps decimal precision).
