import { z } from 'zod';

/** Machine-readable error codes returned in `error.code`. */
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_JSON: 'INVALID_JSON',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  EMAIL_TAKEN: 'EMAIL_TAKEN',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export const apiErrorSchema = z
  .object({
    error: z.object({
      code: z.string(),
      message: z.string(),
      details: z.unknown().optional(),
      requestId: z.string().optional(),
    }),
  })
  .meta({ id: 'ApiError' });
export type ApiErrorBody = z.infer<typeof apiErrorSchema>;

export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function paginatedSchema<T extends z.ZodType>(item: T) {
  return z.object({
    items: z.array(item),
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  });
}
