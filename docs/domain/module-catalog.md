# Module catalog

The full functional map of the product, phased. Scope is informed by a detailed study of a leading regional ERP (about 2,800 manual, FAQ and tutorial articles, plus a live account). Business rules are summarized in [reference-rules.md](reference-rules.md).

Legend: ✅ done · 🟡 in progress · 📋 planned.

## Foundation (cross-cutting)

| Module                 | Scope                                                                                                                                                                                                                                     | State                    |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| Platform / tenants     | Signup, tenant profile, plans and quotas, enabled modules (apps manager), suspension                                                                                                                                                      | ✅ signup · 📋 plans     |
| Identity               | Users, login, roles and permissions (all / own / assigned scopes), invitations, password reset, 2FA                                                                                                                                       | ✅ login · 📋 rest       |
| Settings               | Company profile, National Address, VAT number, base currency and exchange rates, branches, taxes, payment methods, numbering (prefix tokens, yearly reset, per branch), print templates, email / SMS / WhatsApp templates, auto reminders | 📋                       |
| Audit and activity log | Who did what, when; per document and per user                                                                                                                                                                                             | 🟡 createdBy / updatedBy |
| Files                  | Attachments on any document (S3 / MinIO)                                                                                                                                                                                                  | 📋                       |
| Notifications          | Email, SMS, WhatsApp, in-app; reminder rules                                                                                                                                                                                              | 📋                       |

## Phase 1: core trading (MVP)

| Module                | Key entities                                                                                                                                         | Notes                                                            |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| CRM → Clients         | Client (individual / business, VAT, CR, National Address, credit limit, opening balance), contacts, categories, follow-up statuses, appointments     | ✅ clients CRUD · 📋 the rest                                    |
| Products and services | Product, service, bundle; units of measure (unit templates); barcodes; price lists; minimum price                                                    | Shared by sales, purchasing and inventory                        |
| Sales                 | Estimate → Sales order → Invoice → Credit note / Refund; client payments; advance payments; recurring invoices; offers and coupons                   | Totals via `calculateLine`; immutable after issue                |
| ZATCA e-invoicing     | Onboarding (CSID), standard (clearance) vs simplified (reporting), XML, QR, hash chain                                                               | Required for KSA. See [zatca.md](../compliance/zatca.md)         |
| Accounting            | Chart of accounts (Saudi template), journal entries (auto and manual), accounts routing, cost centers, financial periods and closing, VAT settlement | See [accounting-engine.md](../architecture/accounting-engine.md) |
| Finance               | Treasuries and bank accounts, transfers, expenses, incomes, employee custody                                                                         | Permissions per treasury (deposit / withdraw)                    |
| Reports (core)        | Client statement, aged receivables, sales by period/client/item, P&L, balance sheet, trial balance, VAT return                                       | Accrual basis; cash-basis views where relevant                   |

## Phase 2: operations

| Module                  | Key entities                                                                                                                                                     | Notes                                                           |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Inventory               | Warehouses, requisitions (inbound / outbound / transfer), stocktaking, moving-average cost, serial / lot / expiry tracking, landed costs                         | Every stock move is a requisition                               |
| Purchasing              | Purchase request → RFQ → Quotation → Purchase order → Purchase invoice → Return / Debit note; suppliers; supplier payments                                       | Approval steps configurable                                     |
| **Rental and units**    | Unit types, units, pricing rules (day / hour / day+hour, weekday prices), seasonal prices, reservations, availability calendar, lease contracts and installments | **Priority for event-rental customers.** See improvements below |
| Work orders / workflows | Custom document types with custom fields, statuses and linked transactions (for example printing orders); budget and profitability                               | Configurable per industry                                       |
| POS                     | Sessions and shifts, cash counting, receipts, offline desktop app                                                                                                | Session-based or per-invoice posting                            |

## Phase 3: people and verticals

| Module                                          | Key entities                                                                                            |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| HR                                              | Employees, departments, designations, documents with expiry, requests and approvals                     |
| Attendance                                      | Shifts, punches, attendance days and sheets, leave types, policies and balances, holidays, devices      |
| Payroll                                         | Contracts, salary components (formula-based), structures, pay runs, payslips, loans; Mudad / WPS export |
| Installments, commissions, loyalty, memberships | Installment agreements, sales targets and tiered commissions, loyalty points, memberships and credits   |
| Manufacturing                                   | BOM, workstations, production plans, manufacturing orders, indirect cost allocation                     |
| Integrations                                    | E-commerce (Salla, Zid, Shopify), payment gateways, public API keys and webhooks                        |

## Where we plan to beat the reference product

These gaps showed up in the study. They matter for our first customers (event rentals, printing).

1. **Rental deposits and handover.** First-class security deposits (collect, hold as a liability, refund or deduct), a handover / return checklist with condition notes and photos, late-return and damage fees, and real-time availability across reservations and leases.
2. **Printing / job costing.** Cost estimation from materials, machine time and labor; quote → job → invoice; actual vs estimated profit per job.
3. **Immutable print snapshots.** Printed documents keep the company details from issue time (the reference product re-renders old invoices with today's data).
4. **Exact totals.** Inclusive-tax extraction without 0.01 drift (already implemented in `calculateLine`).
5. **Arabic-first UX** with complete translations, including validation messages.
