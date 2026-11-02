import Decimal from 'decimal.js';

/**
 * Decimal constructor used for every money and quantity calculation.
 *
 * Never use JavaScript `number` arithmetic for money: 0.1 + 0.2 !== 0.3.
 * Amounts travel through the API as decimal strings (for example "1250.50") and are stored
 * in MongoDB as Decimal128. See docs/adr/0006-money-as-decimal.md.
 */
export const Money = Decimal.clone({ precision: 34, rounding: Decimal.ROUND_HALF_UP });

export type DecimalInput = Decimal.Value;

/** Up to 15 integer digits and up to 4 decimals; unit prices may need 4 decimals. */
export const DECIMAL_STRING_REGEX = /^-?\d{1,15}(\.\d{1,4})?$/;

export function toDecimal(value: DecimalInput): Decimal {
  return new Money(value);
}

/** Round half-up to the currency's minor units (2 for SAR). */
export function roundMoney(value: DecimalInput, minorUnits = 2): Decimal {
  return new Money(value).toDecimalPlaces(minorUnits, Decimal.ROUND_HALF_UP);
}

/** Round and serialize with a fixed number of decimals, for example "115.00". */
export function formatDecimal(value: DecimalInput, minorUnits = 2): string {
  return roundMoney(value, minorUnits).toFixed(minorUnits);
}

export function sumDecimals(values: readonly DecimalInput[]): Decimal {
  return values.reduce<Decimal>((total, value) => total.plus(value), new Money(0));
}
