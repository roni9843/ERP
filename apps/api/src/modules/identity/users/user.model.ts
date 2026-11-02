import { SYSTEM_ROLES, type UserDto } from '@erp/shared';
import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';
import {
  tenantIdField,
  tenantScopePlugin,
} from '../../../core/database/plugins/tenant-scope.plugin';

const userSchema = new Schema(
  {
    tenantId: tenantIdField,
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: SYSTEM_ROLES, required: true, default: 'staff' },
    status: {
      type: String,
      enum: ['active', 'disabled'] as const,
      required: true,
      default: 'active',
    },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);
userSchema.plugin(tenantScopePlugin);

// One email = one login across the whole platform, so login needs no tenant picker.
// Revisit if one person must belong to several companies (docs/architecture/multi-tenancy.md).
userSchema.index({ email: 1 }, { unique: true });

export type User = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<User>;

export const UserModel = model('User', userSchema);

export function toUserDto(user: UserDocument): UserDto {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
