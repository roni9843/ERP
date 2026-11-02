# Glossary (English / Arabic)

Use these terms consistently in code, UI and docs. The Arabic column is the usual Saudi business term, which helps when writing translations.

| Term                            | Arabic                           | Meaning in this product                                                          |
| ------------------------------- | -------------------------------- | -------------------------------------------------------------------------------- |
| Tenant                          | مستأجر (حساب شركة)               | One customer company of the SaaS; all its data carries `tenantId`                |
| Branch                          | فرع                              | A subdivision of a tenant with its own users, treasuries, warehouses, numbering  |
| Client / Customer               | عميل                             | Someone we sell to                                                               |
| Supplier / Vendor               | مورد                             | Someone we buy from                                                              |
| Quotation / Estimate            | عرض سعر                          | Price offer before a sale; converts to a sales order or invoice                  |
| Sales order                     | أمر بيع                          | Confirmed order before invoicing; can be invoiced partially                      |
| Tax invoice                     | فاتورة ضريبية                    | B2B invoice (ZATCA "standard"), cleared by ZATCA before sharing                  |
| Simplified tax invoice          | فاتورة ضريبية مبسطة              | B2C invoice (ZATCA "simplified"), reported to ZATCA within 24 hours              |
| Credit note                     | إشعار دائن                       | Reduces what a client owes (return, discount after sale)                         |
| Debit note                      | إشعار مدين                       | Increases what a client owes, or reduces what we owe a supplier                  |
| Refund receipt                  | إيصال استرداد                    | Return with money paid back                                                      |
| Advance payment                 | دفعة مقدمة                       | Money received before the invoice; VAT applies on receipt in KSA                 |
| Price list                      | قائمة أسعار                      | Alternative prices for clients or branches                                       |
| Unit of measure / Unit template | وحدة القياس                      | Base unit plus conversion factors (piece, box of 12, roll 50 m)                  |
| Warehouse                       | مستودع                           | Stock location with its own inventory account                                    |
| Requisition                     | إذن مخزني (إذن صرف / إذن استلام) | The document behind every stock movement (in, out, transfer)                     |
| Stocktaking                     | جرد                              | Counting stock and posting the differences                                       |
| Moving average cost             | متوسط التكلفة المرجح             | `(stock value + incoming value) / (stock qty + incoming qty)`                    |
| Cost of goods sold (COGS)       | تكلفة البضاعة المباعة            | Expense recognized when goods leave stock for a sale                             |
| Landed cost                     | تكاليف الشحن والجمارك المحملة    | Freight and customs added to inventory cost                                      |
| Chart of accounts               | دليل الحسابات                    | Tree of ledger accounts                                                          |
| Journal entry                   | قيد يومية                        | Balanced set of debit and credit lines                                           |
| Debit / Credit                  | مدين / دائن                      | The two sides of an entry                                                        |
| Accounts routing                | توجيه الحسابات                   | Rules choosing which account a transaction posts to                              |
| Cost center                     | مركز تكلفة                       | Analytical dimension for expenses and revenue                                    |
| Financial period                | الفترة المالية                   | Accounting period; closing it makes it read-only                                 |
| Treasury / Cash box             | خزينة                            | A cash account (petty cash, cashier drawer)                                      |
| Employee custody                | عهدة الموظف                      | Money advanced to an employee, settled with expenses                             |
| Fixed asset / Depreciation      | أصل ثابت / إهلاك                 | Long-lived asset and its periodic expense                                        |
| VAT                             | ضريبة القيمة المضافة             | Value Added Tax, 15% standard rate in KSA                                        |
| VAT registration number         | الرقم الضريبي                    | 15 digits, starting and ending with 3                                            |
| Commercial Registration (CR)    | السجل التجاري                    | Company registration, 10 digits                                                  |
| National Address                | العنوان الوطني                   | Saudi address: building no., street, district, city, postal code, additional no. |
| ZATCA                           | هيئة الزكاة والضريبة والجمارك    | Zakat, Tax and Customs Authority (e-invoicing regulator)                         |
| Fatoora                         | فاتورة (منصة فاتورة)             | ZATCA's e-invoicing platform and portal                                          |
| CSID                            | معرف ختم التشفير                 | Cryptographic Stamp Identifier: the certificate a device uses to sign invoices   |
| Iqama                           | إقامة                            | Residence permit number of a foreign employee                                    |
| GOSI                            | التأمينات الاجتماعية             | General Organization for Social Insurance (payroll deductions)                   |
| Mudad / WPS                     | مدد / نظام حماية الأجور          | Wage Protection System for payroll compliance                                    |
| End of service benefit          | مكافأة نهاية الخدمة              | Gratuity due when employment ends (Saudi Labor Law)                              |
| Hijri date                      | التاريخ الهجري                   | Islamic calendar; display option next to Gregorian                               |
| Pay run / Payslip               | مسير الرواتب / قسيمة الراتب      | Payroll batch for a period / one employee's statement                            |
| Reservation (rental)            | حجز                              | Booking of a rental unit for a time range                                        |
| Lease contract                  | عقد إيجار                        | Long-term rental with an installment schedule                                    |
| Security deposit                | تأمين / مبلغ ضمان                | Refundable amount held during a rental                                           |
