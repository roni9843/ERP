import type { RequestHandler } from 'express';
import helmet from 'helmet';

const strictHeaders = helmet();
// The API reference page loads its UI bundle from a CDN, so it gets a relaxed CSP.
const docsHeaders = helmet({ contentSecurityPolicy: false });

export const securityHeaders: RequestHandler = (req, res, next) => {
  if (req.path.startsWith('/api/docs')) {
    docsHeaders(req, res, next);
    return;
  }
  strictHeaders(req, res, next);
};
