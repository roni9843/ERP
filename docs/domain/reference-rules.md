# Business rules reference

These are the most important business rules observed in a mature Saudi/MENA ERP (Daftra), condensed from a study of its public documentation (558 manual articles, 600 FAQs, 1,746 tutorials) and a live account. Use them as a **reference for expected behavior**, not as a spec to copy: we write our own UI, texts and code. Rules marked **[decision]** are ones we must decide ourselves, because the reference is silent or inconsistent.

## 1. Posting and accounting

1. Every transaction generates journal entries automatically. **Accounts routing** chooses the account: Automatic (default account), Specify per each (per client, product or document), or Cancel (no entry).
2. A sales invoice produces separate entries: the sale (Dr Client / Cr Sales + Cr VAT), the payment if marked paid, and cost of goods sold (Dr Cost of Sales / Cr Inventory). COGS timing is configurable: immediately, on requisition approval, or on the delivery date.
3. Payment entries exist only for payments with status **Completed**.
4. Generated entries are read-only. Users change the source document; the system reverses and re-posts.
5. Exactly one financial period is open. Closing posts P&L → Retained Earnings and makes the period read-only. "Closed periods" are date locks that post nothing.
6. All opening balances go through an **Opening Balances** equity account. Opening stock comes in through requisitions; assets through the assets module.

## 2. Sales and tax

7. Order of computation: **discount first, then tax**. A fixed line discount is **per unit** (100 × 10 with a 20 discount = 200 off). A line can have two taxes, both applied to the same net (**no tax on tax**). Withholding tax is a **negative** exclusive rate (1,000 + 14% − 1% = 1,130). Rounding: 2 decimals per line. Retention and adjustment apply after tax.
8. Tax-inclusive prices: `net = price ÷ (1 + rate)`, so 1,000 at 15% → net 869.57 and VAT 130.43. **[decision]** We extract tax as `amount × r / (100 + Σr)` with net = amount − taxes, to avoid the reference product's 0.01 drift with two inclusive taxes.
9. VAT is recognized when the invoice is **issued** (accrual). Cash vs accrual is only a filter on the VAT report. Each tax has two accounts: Income VAT (collected) and Outcome VAT (paid). Period settlement nets them into a VAT payable account.
10. A credit note **does not reduce the invoice total**. It creates client credit, which is applied like a payment (auto-apply to the oldest unpaid invoice when enabled). Credit note or refund: Dr Sales Returns + VAT / Cr Client, and returned goods go back to stock. Cumulative returned quantity cannot exceed the invoiced quantity.
11. Credit limit: an invoice is rejected when the previous unpaid balance + the new invoice > the client's credit limit.
12. Deleting a document moves it to a **recycle bin for 90 days**, and its number stays reserved. Documents sent to ZATCA cannot be deleted; in KSA an invoice is **locked once issued**. Corrections go through credit or debit notes.
13. Price precedence: the price list chosen on the document → the client's price list → the branch's default list → the product's selling price. Maximum discount is a per-user percentage. Minimum price includes tax and does not bind admins.
14. Estimate → Sales order → Invoice conversions can be partial and are tracked per line. A converted quotation can produce only one invoice.

## 3. Inventory

15. Costing is **moving weighted average only** (no FIFO), with **one average per product across all warehouses**: `(onHandValue + inValue) / (onHandQty + inQty)`. Sales, transfers, stocktaking and purchase returns use the current average and do not change it.
16. Back-dated stock transactions trigger recalculation from that date and re-post later COGS entries (in the background when older than about 3 days). Closed periods are excluded.
17. Every stock movement is a **requisition** (inbound, outbound or transfer, from invoices, purchases, manufacturing or stocktaking) with statuses Under Delivery → Accepted / Rejected. Each warehouse has its own inventory account.
18. **Trap:** a zero-price receipt posts no entry but lowers the average cost. This is the main cause of "wrong COGS" support cases. **[decision]** Warn or block.
19. Landed costs (freight, customs) are allocated to a receipt by value, quantity or manually, and increase the average cost. Tax never enters cost.

## 4. Purchasing

20. Purchase invoice posting has two modes. Goods received directly: Dr Inventory + VAT / Cr Supplier. With requisitions: Dr Purchases / Cr Supplier, then Dr Inventory / Cr Purchases on receipt. Services and untracked items: Dr Cost of Sales.
21. Debit note or purchase return: Dr Supplier / Cr Inventory at average cost, and stock decreases. A purchase credit note **increases** the payable.
22. "Update product prices after purchase" sets the purchase price to the last invoice price and recomputes the selling price from the profit margin.

## 5. POS

23. Session mode: sales post to the cashier's petty cash; validating the session moves the money to the treasury or bank by payment method. Expected cash = sales − refunds ± cash movements. Shortages go to a Loss account and overages to a Profit account (auto-adjustment).

## 6. Payroll and attendance

24. Punch logs → attendance day → attendance sheet (approval locks it) → pay run → payslips. Salary formulas can use attendance variables (for example "days late more than 60 min × 100").
25. Payroll accounting: **approve** posts Dr Salaries & Wages / Cr deductions, Cr Advances (loan installments), Cr Accrued Wages; **pay** posts Dr Accrued Wages / Cr Treasury. Overtime is not built in; it is modeled with attendance rules. Approval workflows: any one approver per level is enough; a rejection at any level ends the request.

## 7. Rentals (priority for our first customers)

26. Pricing Rule → Unit Type → Unit → Reservation. Methods: **Days** (the day count rounds up: 2.4 → 3), **Hours** (minimum hours; slots of 5 / 15 / 30 / 60 minutes), **Days & Hours** (full 24-hour blocks at the day price plus leftover minutes at hour price ÷ 60). Weekday-specific prices exist ("advanced" rules).
27. Each day is priced by its own rule. A seasonal price replaces the normal rule inside its date range; with overlapping seasons the most recent wins. Rule, unit type and season must use the same method.
28. Availability depends on reservation status: statuses listed as "allowing reservations" (for example cancelled or completed) free the unit; every other status, **including Pending**, blocks it. Automatic orders pick a free unit by priority. Once invoiced, a reservation is locked.
29. **Not supported in the reference product** (our opportunity): reservation deposits, handover/return workflow, late-return and damage fees. They use workarounds (advance payments, custom statuses).

## 8. Platform behaviors

30. Branches separate users, treasuries, warehouses and numbering; clients and products can be shared. Numbering uses prefix tokens (for example `%Y`), optional yearly reset, per-branch sequences, and drafts take no number. The default currency locks after the first transaction. **Warning:** editing an exchange rate retroactively changes past transactions in the reference product. **[decision]** We will not do that.

## Known errors in the reference documentation

| Topic                                  | Documented                     | Correct                                                                   |
| -------------------------------------- | ------------------------------ | ------------------------------------------------------------------------- |
| Inclusive tax example (100 at 15%)     | net 89.96                      | **86.96** (VAT 13.04)                                                     |
| Manufacturing "based on quantity" cost | amount × (BOM qty ÷ order qty) | amount × (**order qty ÷ BOM qty**); the docs' own example gives 100 → 140 |
| Landed-cost example                    | 483.817                        | 483.871                                                                   |
| Bundle types (pack vs compound)        | Names swapped between articles | Design from behavior: pre-assembled vs assembled at sale                  |
