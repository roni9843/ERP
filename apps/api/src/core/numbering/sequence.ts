import { Schema, model } from 'mongoose';
import { tenantIdField, tenantScopePlugin } from '../database/plugins/tenant-scope.plugin';

/**
 * Per-tenant counters for human-readable document numbers (C-000001, INV-2026-000123, …).
 *
 * The increment is a single atomic `findOneAndUpdate` with `$inc`, so concurrent requests never
 * get the same number. Planned (see docs/domain/reference-rules.md, "Settings"): configurable
 * prefixes with date tokens, yearly reset, per-branch sequences, and drafts that do not consume a number.
 */
const sequenceSchema = new Schema(
  {
    tenantId: tenantIdField,
    key: { type: String, required: true },
    value: { type: Number, required: true },
  },
  { timestamps: true },
);
sequenceSchema.plugin(tenantScopePlugin);
sequenceSchema.index({ tenantId: 1, key: 1 }, { unique: true });

export const SequenceModel = model('Sequence', sequenceSchema);

/** Atomically increments and returns the next value of the tenant's counter `key`. */
export async function nextSequenceValue(key: string): Promise<number> {
  const sequence = await SequenceModel.findOneAndUpdate(
    { key },
    { $inc: { value: 1 } },
    { upsert: true, returnDocument: 'after' },
  );
  if (!sequence) throw new Error(`Sequence "${key}" could not be incremented`);
  return sequence.value;
}

export function formatDocumentNumber(prefix: string, value: number, digits = 6): string {
  return `${prefix}${String(value).padStart(digits, '0')}`;
}
