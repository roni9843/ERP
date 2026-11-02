import { z } from 'zod';
import {
  commercialRegistrationSchema,
  decimalStringSchema,
  nationalAddressSchema,
  paginationQuerySchema,
  saudiVatNumberSchema,
} from '../common';

export const CLIENT_TYPES = ['individual', 'business'] as const;
export const CLIENT_STATUSES = ['active', 'suspended'] as const;

export const clientTypeSchema = z.enum(CLIENT_TYPES);
export const clientStatusSchema = z.enum(CLIENT_STATUSES);

const clientFields = z.object({
  type: clientTypeSchema.default('business'),
  name: z.string().trim().min(1, 'Name is required').max(200),
  email: z.email('Invalid email address').max(254).optional(),
  phone: z.string().trim().max(30).optional(),
  vatNumber: saudiVatNumberSchema.optional(),
  crNumber: commercialRegistrationSchema.optional(),
  address: nationalAddressSchema.optional(),
  /** Maximum unpaid balance before new invoices are blocked. Empty = no limit. */
  creditLimit: decimalStringSchema.optional(),
  notes: z.string().trim().max(2000).optional(),
});

export const clientCreateSchema = clientFields.meta({ id: 'ClientCreateInput' });
export type ClientCreateInput = z.infer<typeof clientCreateSchema>;
/** Shape accepted by forms before defaults are applied. */
export type ClientCreateFormValues = z.input<typeof clientCreateSchema>;

export const clientUpdateSchema = clientFields
  .extend({ status: clientStatusSchema })
  .partial()
  .meta({ id: 'ClientUpdateInput' });
export type ClientUpdateInput = z.infer<typeof clientUpdateSchema>;

export const clientListQuerySchema = paginationQuerySchema.extend({
  type: clientTypeSchema.optional(),
  status: clientStatusSchema.optional(),
});
export type ClientListQuery = z.infer<typeof clientListQuerySchema>;

export const clientDtoSchema = z
  .object({
    id: z.string(),
    code: z.string(),
    type: clientTypeSchema,
    name: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    vatNumber: z.string().optional(),
    crNumber: z.string().optional(),
    address: nationalAddressSchema.optional(),
    creditLimit: z.string().optional(),
    notes: z.string().optional(),
    status: clientStatusSchema,
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .meta({ id: 'Client' });
export type ClientDto = z.infer<typeof clientDtoSchema>;
