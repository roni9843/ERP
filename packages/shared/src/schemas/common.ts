import { z } from 'zod';
import { DECIMAL_STRING_REGEX } from '../money/decimal';

/** MongoDB ObjectId as a 24-character hex string. */
export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

/** Money and quantities travel as decimal strings, never as JS numbers. */
export const decimalStringSchema = z.string().trim().regex(DECIMAL_STRING_REGEX, 'Invalid amount');

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().min(1).max(100).optional(),
  /** Field name, prefixed with "-" for descending order, for example "-createdAt". */
  sort: z
    .string()
    .regex(/^-?[a-zA-Z]+$/, 'Invalid sort field')
    .optional(),
});
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

/** Saudi VAT registration number: 15 digits, starting and ending with 3. */
export const saudiVatNumberSchema = z
  .string()
  .regex(/^3\d{13}3$/, 'VAT number must be 15 digits, starting and ending with 3');

/** Saudi Commercial Registration (CR) number: 10 digits. */
export const commercialRegistrationSchema = z
  .string()
  .regex(/^\d{10}$/, 'CR number must be 10 digits');

/** Saudi National Address (required on B2B tax invoices). */
export const nationalAddressSchema = z.object({
  buildingNumber: z
    .string()
    .regex(/^\d{4}$/, 'Building number must be 4 digits')
    .optional(),
  street: z.string().trim().max(120).optional(),
  district: z.string().trim().max(120).optional(),
  city: z.string().trim().max(80).optional(),
  postalCode: z
    .string()
    .regex(/^\d{5}$/, 'Postal code must be 5 digits')
    .optional(),
  additionalNumber: z
    .string()
    .regex(/^\d{4}$/, 'Additional number must be 4 digits')
    .optional(),
  countryCode: z.string().length(2).default('SA'),
});
export type NationalAddress = z.infer<typeof nationalAddressSchema>;
