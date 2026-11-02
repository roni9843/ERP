import { describe, expect, it } from 'vitest';
import { calculateLine, summarizeLines, type LineTax } from './line-calculator';

const VAT_EXCLUSIVE: LineTax = { code: 'VAT', rate: '15', inclusive: false };
const VAT_INCLUSIVE: LineTax = { code: 'VAT', rate: '15', inclusive: true };

describe('calculateLine', () => {
  it('adds exclusive VAT on top of the net amount', () => {
    const line = calculateLine({ quantity: 1, unitPrice: '100', taxes: [VAT_EXCLUSIVE] });
    expect(line).toMatchObject({
      gross: '100.00',
      net: '100.00',
      taxTotal: '15.00',
      total: '115.00',
    });
  });

  it('extracts inclusive VAT so that the total equals the entered price (100 → 86.96 + 13.04)', () => {
    const line = calculateLine({ quantity: 1, unitPrice: '100', taxes: [VAT_INCLUSIVE] });
    expect(line).toMatchObject({ net: '86.96', taxTotal: '13.04', total: '100.00' });
  });

  it('extracts inclusive VAT without rounding drift (1,000 → 869.57 + 130.43)', () => {
    const line = calculateLine({ quantity: 1, unitPrice: '1000', taxes: [VAT_INCLUSIVE] });
    expect(line).toMatchObject({ net: '869.57', taxTotal: '130.43', total: '1000.00' });
  });

  it('treats a fixed discount as a per-unit amount, applied before tax', () => {
    const line = calculateLine({
      quantity: 10,
      unitPrice: '100',
      discount: { type: 'amount', value: '20' },
      taxes: [VAT_EXCLUSIVE],
    });
    expect(line).toMatchObject({
      gross: '1000.00',
      discount: '200.00',
      net: '800.00',
      taxTotal: '120.00',
      total: '920.00',
    });
  });

  it('applies a percentage discount to the gross before tax', () => {
    const line = calculateLine({
      quantity: 2,
      unitPrice: '50',
      discount: { type: 'percent', value: '10' },
      taxes: [VAT_EXCLUSIVE],
    });
    expect(line).toMatchObject({
      discount: '10.00',
      net: '90.00',
      taxTotal: '13.50',
      total: '103.50',
    });
  });

  it('never compounds two taxes (both apply to the same net)', () => {
    const line = calculateLine({
      quantity: 1,
      unitPrice: '1000',
      taxes: [
        { code: 'VAT', rate: '14', inclusive: false },
        { code: 'OTHER', rate: '5', inclusive: false },
      ],
    });
    expect(line.taxes.map((t) => t.amount)).toEqual(['140.00', '50.00']);
    expect(line.total).toBe('1190.00');
  });

  it('models withholding tax as a negative rate (1,000 + 14% − 1% = 1,130)', () => {
    const line = calculateLine({
      quantity: 1,
      unitPrice: '1000',
      taxes: [
        { code: 'VAT', rate: '14', inclusive: false },
        { code: 'WHT', rate: '-1', inclusive: false },
      ],
    });
    expect(line.taxes.map((t) => t.amount)).toEqual(['140.00', '-10.00']);
    expect(line.total).toBe('1130.00');
  });

  it('supports three-decimal currencies', () => {
    const line = calculateLine({ quantity: 3, unitPrice: '1.2345', taxes: [VAT_EXCLUSIVE] }, 3);
    expect(line).toMatchObject({ gross: '3.704', taxTotal: '0.556', total: '4.260' });
  });

  it('rejects invalid input', () => {
    expect(() => calculateLine({ quantity: -1, unitPrice: '10' })).toThrow(RangeError);
    expect(() =>
      calculateLine({ quantity: 1, unitPrice: '10', discount: { type: 'amount', value: '11' } }),
    ).toThrow(RangeError);
    expect(() =>
      calculateLine({
        quantity: 1,
        unitPrice: '10',
        taxes: [VAT_EXCLUSIVE, VAT_EXCLUSIVE, VAT_EXCLUSIVE],
      }),
    ).toThrow(RangeError);
  });
});

describe('summarizeLines', () => {
  it('sums rounded line amounts without re-rounding', () => {
    const lines = [
      calculateLine({ quantity: 1, unitPrice: '100', taxes: [VAT_INCLUSIVE] }),
      calculateLine({ quantity: 1, unitPrice: '1000', taxes: [VAT_INCLUSIVE] }),
    ];
    expect(summarizeLines(lines)).toEqual({
      gross: '1100.00',
      discount: '0.00',
      net: '956.53',
      taxTotal: '143.47',
      total: '1100.00',
    });
  });
});
