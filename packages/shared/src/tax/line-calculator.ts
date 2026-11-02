import type Decimal from 'decimal.js';
import { MAX_TAXES_PER_LINE } from '../constants/tax';
import { Money, roundMoney, sumDecimals, type DecimalInput } from '../money/decimal';

/**
 * Document line calculation (invoices, estimates, credit notes, purchase invoices, …).
 *
 * Rules (see docs/domain/reference-rules.md, "Sales and tax"):
 *  1. gross = quantity × unitPrice
 *  2. Discount comes BEFORE tax. A percentage applies to the gross; a fixed amount is PER UNIT
 *     (unit price 100 × 10 units with a 20 discount → 200 off).
 *  3. Inclusive taxes are extracted from the discounted amount:
 *     tax_i = amount × rate_i / (100 + Σ inclusive rates). The net is then amount − Σ inclusive taxes,
 *     so net + taxes always equals the entered amount exactly (no 0.01 drift).
 *  4. Exclusive taxes are added on the same net. Taxes never compound (no tax on tax).
 *  5. A negative rate models a withholding tax (1,000 + 14% − 1% = 1,130).
 *  6. Every amount is rounded half-up to the currency's minor units at the line level.
 *     Document totals are the sums of the rounded line amounts.
 */

export type DiscountType = 'percent' | 'amount';

export interface LineTax {
  /** Tax identifier, for example "VAT". */
  code: string;
  /** Rate in percent ("15" means 15 %). Negative for withholding taxes. */
  rate: DecimalInput;
  /** True when the unit price already contains this tax. */
  inclusive: boolean;
}

export interface LineInput {
  quantity: DecimalInput;
  unitPrice: DecimalInput;
  /** `amount` is a discount per unit; `percent` applies to the line gross. */
  discount?: { type: DiscountType; value: DecimalInput } | undefined;
  taxes?: readonly LineTax[] | undefined;
}

export interface LineTaxResult {
  code: string;
  rate: string;
  inclusive: boolean;
  amount: string;
}

export interface LineResult {
  /** quantity × unitPrice */
  gross: string;
  /** Total discount of the line. */
  discount: string;
  /** Taxable amount, excluding every tax. */
  net: string;
  taxes: LineTaxResult[];
  taxTotal: string;
  /** net + taxTotal */
  total: string;
}

export function calculateLine(input: LineInput, minorUnits = 2): LineResult {
  const quantity = new Money(input.quantity);
  const unitPrice = new Money(input.unitPrice);
  const taxes = input.taxes ?? [];

  if (quantity.isNegative()) throw new RangeError('quantity must not be negative');
  if (unitPrice.isNegative()) throw new RangeError('unitPrice must not be negative');
  if (taxes.length > MAX_TAXES_PER_LINE) {
    throw new RangeError(`a line can carry at most ${MAX_TAXES_PER_LINE} taxes`);
  }

  const gross = roundMoney(quantity.times(unitPrice), minorUnits);

  let discount: Decimal = new Money(0);
  if (input.discount) {
    const value = new Money(input.discount.value);
    if (value.isNegative()) throw new RangeError('discount must not be negative');
    discount =
      input.discount.type === 'percent' ? gross.times(value).dividedBy(100) : value.times(quantity);
    discount = roundMoney(discount, minorUnits);
  }
  if (discount.greaterThan(gross)) throw new RangeError('discount must not exceed the line amount');

  const amount = gross.minus(discount);

  const inclusiveRateSum = sumDecimals(taxes.filter((t) => t.inclusive).map((t) => t.rate));
  const inclusiveDivisor = new Money(100).plus(inclusiveRateSum);

  const inclusiveAmounts = new Map<LineTax, Decimal>();
  for (const tax of taxes) {
    if (tax.inclusive) {
      inclusiveAmounts.set(
        tax,
        roundMoney(amount.times(tax.rate).dividedBy(inclusiveDivisor), minorUnits),
      );
    }
  }
  const net = amount.minus(sumDecimals([...inclusiveAmounts.values()]));

  const taxResults: LineTaxResult[] = taxes.map((tax) => {
    const taxAmount =
      inclusiveAmounts.get(tax) ?? roundMoney(net.times(tax.rate).dividedBy(100), minorUnits);
    return {
      code: tax.code,
      rate: new Money(tax.rate).toString(),
      inclusive: tax.inclusive,
      amount: taxAmount.toFixed(minorUnits),
    };
  });

  const taxTotal = sumDecimals(taxResults.map((t) => t.amount));

  return {
    gross: gross.toFixed(minorUnits),
    discount: discount.toFixed(minorUnits),
    net: net.toFixed(minorUnits),
    taxes: taxResults,
    taxTotal: taxTotal.toFixed(minorUnits),
    total: net.plus(taxTotal).toFixed(minorUnits),
  };
}

export interface LinesSummary {
  gross: string;
  discount: string;
  net: string;
  taxTotal: string;
  total: string;
}

/** Document totals are sums of already-rounded line amounts (never re-rounded). */
export function summarizeLines(lines: readonly LineResult[], minorUnits = 2): LinesSummary {
  const sum = (pick: (line: LineResult) => string) =>
    sumDecimals(lines.map(pick)).toFixed(minorUnits);
  return {
    gross: sum((l) => l.gross),
    discount: sum((l) => l.discount),
    net: sum((l) => l.net),
    taxTotal: sum((l) => l.taxTotal),
    total: sum((l) => l.total),
  };
}
