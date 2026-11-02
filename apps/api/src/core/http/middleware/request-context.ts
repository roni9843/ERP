import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';
import { requestContext, type Locale } from '../../context/request-context';
import { getRequestId } from './request-id';

function pickLocale(acceptLanguage: string | undefined): Locale {
  return acceptLanguage?.toLowerCase().startsWith('en') ? 'en' : 'ar';
}

/**
 * Opens the AsyncLocalStorage context for the rest of the request.
 * Registered AFTER the body parser on purpose: stream callbacks inside body parsing
 * would otherwise run outside the context.
 */
export const requestContextMiddleware: RequestHandler = (req, res, next) => {
  requestContext.run(
    {
      requestId: getRequestId(res.locals) ?? randomUUID(),
      locale: pickLocale(req.get('accept-language')),
    },
    () => next(),
  );
};
