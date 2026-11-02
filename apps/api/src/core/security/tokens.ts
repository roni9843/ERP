import { SYSTEM_ROLES, type SystemRole } from '@erp/shared';
import { SignJWT, jwtVerify } from 'jose';
import { z } from 'zod';
import { getConfig } from '../../config/env';
import { AppError } from '../errors/app-error';

const ISSUER = 'erp-api';
const AUDIENCE = 'erp-web';

export interface AccessTokenClaims {
  /** User id */
  sub: string;
  /** Tenant id */
  tid: string;
  role: SystemRole;
}

const claimsSchema = z.object({
  sub: z.string().min(1),
  tid: z.string().min(1),
  role: z.enum(SYSTEM_ROLES),
});

function secretKey(): Uint8Array {
  return new TextEncoder().encode(getConfig().jwt.accessSecret);
}

/** Short-lived access token (HS256). Refresh-token rotation is planned; see docs/architecture/security.md. */
export async function signAccessToken(claims: AccessTokenClaims): Promise<string> {
  return new SignJWT({ tid: claims.tid, role: claims.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(claims.sub)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(getConfig().jwt.accessTtl)
    .sign(secretKey());
}

export async function verifyAccessToken(token: string): Promise<AccessTokenClaims> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      issuer: ISSUER,
      audience: AUDIENCE,
      algorithms: ['HS256'],
    });
    return claimsSchema.parse(payload);
  } catch {
    throw AppError.unauthorized('Invalid or expired access token');
  }
}
