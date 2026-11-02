import type { SortOrder } from 'mongoose';

/** Escapes user input before it is used inside a RegExp (prevents ReDoS and regex injection). */
export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Turns `?sort=-createdAt` into `{ createdAt: -1 }`, accepting only whitelisted fields.
 * Falls back to `fallback` when the field is missing or not allowed.
 */
export function parseSort(
  sort: string | undefined,
  allowed: readonly string[],
  fallback: Record<string, SortOrder>,
): Record<string, SortOrder> {
  if (!sort) return fallback;
  const descending = sort.startsWith('-');
  const field = descending ? sort.slice(1) : sort;
  return allowed.includes(field) ? { [field]: descending ? -1 : 1 } : fallback;
}

export function paginate(page: number, limit: number): { skip: number; limit: number } {
  return { skip: (page - 1) * limit, limit };
}
