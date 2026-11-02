import { roleHasPermission, type Permission } from '@erp/shared';
import type { RequestHandler } from 'express';
import { requestContext } from '../../context/request-context';
import { AppError } from '../../errors/app-error';

/** Route guard: the authenticated user's role must grant every listed permission. */
export function authorize(...required: Permission[]): RequestHandler {
  return (_req, _res, next) => {
    const role = requestContext.get()?.role;
    if (!role) throw AppError.unauthorized();
    if (!required.every((permission) => roleHasPermission(role, permission))) {
      throw AppError.forbidden();
    }
    next();
  };
}
