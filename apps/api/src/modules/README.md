# Feature modules

Each folder is a feature module with the anatomy of [`crm/clients`](crm/clients): model → service → controller → routes → openapi → index (`AppModule`) → `__tests__`. Register modules in [`index.ts`](index.ts).

| Folder                               | State    | Responsibility                                                                     |
| ------------------------------------ | -------- | ---------------------------------------------------------------------------------- |
| `health/`                            | ✅       | Liveness and readiness                                                             |
| `platform/tenants/`                  | ✅ model | Tenants (companies), plans and enabled modules (platform level, not tenant-scoped) |
| `identity/`                          | ✅ auth  | Users, signup / login / me; next: roles, invitations, password reset               |
| `crm/clients/`                       | ✅       | Clients (reference module)                                                         |
| `settings/`                          | 📋       | Company profile, branches, taxes, currencies, numbering, templates                 |
| `catalog/`                           | 📋       | Products, services, bundles, units, price lists                                    |
| `sales/`                             | 📋       | Estimates, sales orders, invoices, credit notes, refunds, payments                 |
| `einvoicing/`                        | 📋       | ZATCA onboarding, XML, signing, QR, submission                                     |
| `accounting/`                        | 📋       | Chart of accounts, journal entries, posting rules, periods, cost centers           |
| `finance/`                           | 📋       | Treasuries, banks, expenses, incomes, custody                                      |
| `inventory/`                         | 📋       | Warehouses, requisitions, stocktaking, costing                                     |
| `purchasing/`                        | 📋       | Suppliers, purchase cycle, purchase invoices, supplier payments                    |
| `rental/`                            | 📋       | Unit types, units, pricing rules, seasons, reservations, leases, deposits          |
| `operations/`                        | 📋       | Work orders, custom workflows (for example printing orders)                        |
| `pos/`                               | 📋       | Sessions, receipts, cash counting                                                  |
| `hr/`, `attendance/`, `payroll/`     | 📋       | People, time and pay                                                               |
| `reports/`                           | 📋       | Financial and operational reports                                                  |
| `notifications/`, `files/`, `audit/` | 📋       | Cross-cutting services                                                             |

Scope and phases: [docs/domain/module-catalog.md](../../../../docs/domain/module-catalog.md).
