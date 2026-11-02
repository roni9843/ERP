import { z } from 'zod';
import { CURRENCY_CODES } from '../constants/currencies';
import { SYSTEM_ROLES } from '../permissions/catalog';

export const emailSchema = z
  .email('Invalid email address')
  .max(254)
  .transform((value) => value.toLowerCase());

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters');

// `.meta({ id })` is Zod's own metadata; the API's OpenAPI generator turns ids into reusable components.

export const signupSchema = z
  .object({
    companyName: z.string().trim().min(2).max(120),
    name: z.string().trim().min(2).max(120),
    email: emailSchema,
    password: passwordSchema,
  })
  .meta({ id: 'SignupInput' });
export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
  })
  .meta({ id: 'LoginInput' });
export type LoginInput = z.infer<typeof loginSchema>;

export const userDtoSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    role: z.enum(SYSTEM_ROLES),
  })
  .meta({ id: 'User' });
export type UserDto = z.infer<typeof userDtoSchema>;

export const tenantDtoSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    countryCode: z.string(),
    baseCurrency: z.enum(CURRENCY_CODES),
    status: z.enum(['trial', 'active', 'suspended']),
  })
  .meta({ id: 'Tenant' });
export type TenantDto = z.infer<typeof tenantDtoSchema>;

export const authSessionSchema = z
  .object({
    accessToken: z.string(),
    user: userDtoSchema,
    tenant: tenantDtoSchema,
  })
  .meta({ id: 'AuthSession' });
export type AuthSession = z.infer<typeof authSessionSchema>;
