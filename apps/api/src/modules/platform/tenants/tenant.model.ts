import { CURRENCY_CODES, DEFAULT_CURRENCY, type TenantDto } from '@erp/shared';
import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';

/**
 * A tenant is one customer company of the SaaS. This model is platform-level:
 * it is NOT tenant-scoped (no tenantScopePlugin).
 */
const tenantSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    countryCode: { type: String, required: true, default: 'SA' },
    baseCurrency: { type: String, enum: CURRENCY_CODES, required: true, default: DEFAULT_CURRENCY },
    status: {
      type: String,
      enum: ['trial', 'active', 'suspended'] as const,
      required: true,
      default: 'trial',
    },
    /** Subscription plan key; limits per plan are planned (see docs/domain/module-catalog.md). */
    plan: { type: String, required: true, default: 'trial' },
    /** Feature modules switched on for this tenant (the "apps manager"). */
    enabledModules: { type: [String], default: ['crm'] },
  },
  { timestamps: true },
);

export type Tenant = InferSchemaType<typeof tenantSchema>;
export type TenantDocument = HydratedDocument<Tenant>;

export const TenantModel = model('Tenant', tenantSchema);

export function toTenantDto(tenant: TenantDocument): TenantDto {
  return {
    id: tenant._id.toString(),
    name: tenant.name,
    countryCode: tenant.countryCode,
    baseCurrency: tenant.baseCurrency,
    status: tenant.status,
  };
}
