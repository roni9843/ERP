import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';

const SAFE_REQUEST_ID = /^[\w-]{1,100}$/;

/**
 * Assigns a request id (reusing a safe incoming `x-request-id`) and echoes it in the response.
 * The id appears in every log line and in every error body, so a support ticket can be traced.
 */
export const requestIdMiddleware: RequestHandler = (req, res, next) => {
  const incoming = req.get('x-request-id');
  const requestId = incoming && SAFE_REQUEST_ID.test(incoming) ? incoming : randomUUID();
  res.locals.requestId = requestId;
  res.setHeader('x-request-id', requestId);
  next();
};

export function getRequestId(locals: Record<string, unknown>): string | undefined {
  return typeof locals.requestId === 'string' ? locals.requestId : undefined;
}
