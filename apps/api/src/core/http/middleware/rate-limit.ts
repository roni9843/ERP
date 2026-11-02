import { ERROR_CODES } from '@erp/shared';
import { rateLimit } from 'express-rate-limit';
import { getConfig } from '../../../config/env';
import { AppError } from '../../errors/app-error';

/** Brute-force protection for credential endpoints (per IP). Disabled in tests. */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skip: () => getConfig().isTest,
  handler: (_req, _res, next) => {
    next(new AppError(429, ERROR_CODES.RATE_LIMITED, 'Too many attempts. Please try again later.'));
  },
});
