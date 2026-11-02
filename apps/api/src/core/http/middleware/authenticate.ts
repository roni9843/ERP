import type { RequestHandler } from 'express';
import { requestContext } from '../../context/request-context';
import { AppError } from '../../errors/app-error';
import { verifyAccessToken } from '../../security/tokens';

/**
 * Verifies the `Authorization: Bearer <token>` header and puts the user, tenant and role
 * into the request context. From here on, tenant-scoped models filter by this tenant.
 */
export const authenticate: RequestHandler = async (req, _res, next) => {
  const header = req.get('authorization');
  if (!header?.startsWith('Bearer ')) {
    throw AppError.unauthorized('Missing bearer token');
  }

  const claims = await verifyAccessToken(header.slice('Bearer '.length).trim());
  requestContext.assign({ userId: claims.sub, tenantId: claims.tid, role: claims.role });
  next();
};
