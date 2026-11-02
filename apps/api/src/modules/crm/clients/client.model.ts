import { CLIENT_STATUSES, CLIENT_TYPES } from '@erp/shared';
import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';
import { auditFieldsPlugin } from '../../../core/database/plugins/audit-fields.plugin';
import {
  tenantIdField,
  tenantScopePlugin,
} from '../../../core/database/plugins/tenant-scope.plugin';

/** Saudi National Address, embedded (no own _id). */
const nationalAddressSchema = new Schema(
  {
    buildingNumber: String,
    street: String,
    district: String,
    city: String,
    postalCode: String,
    additionalNumber: String,
    countryCode: { type: String, default: 'SA' },
  },
  { _id: false },
);

const clientSchema = new Schema(
  {
    tenantId: tenantIdField,
    /** Human-readable number, unique per tenant (C-000001). */
    code: { type: String, required: true },
    type: { type: String, enum: CLIENT_TYPES, required: true, default: 'business' },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    vatNumber: { type: String, trim: true },
    crNumber: { type: String, trim: true },
    address: { type: nationalAddressSchema },
    /** Money is stored as Decimal128, never as a floating-point number. */
    creditLimit: { type: Schema.Types.Decimal128 },
    notes: { type: String },
    status: { type: String, enum: CLIENT_STATUSES, required: true, default: 'active' },
  },
  { timestamps: true },
);

clientSchema.plugin(tenantScopePlugin);
clientSchema.plugin(auditFieldsPlugin);

// Tenant-scoped uniqueness always starts with tenantId.
clientSchema.index({ tenantId: 1, code: 1 }, { unique: true });
clientSchema.index({ tenantId: 1, name: 1 });

export type Client = InferSchemaType<typeof clientSchema>;
export type ClientDocument = HydratedDocument<Client>;

export const ClientModel = model('Client', clientSchema);
