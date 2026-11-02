import { randomUUID } from 'node:crypto';
import { pinoHttp } from 'pino-http';
import { getLogger } from '../../logger/logger';

/** One structured log line per request, tagged with the request id. Health checks are not logged. */
export function createHttpLogger() {
  return pinoHttp({
    logger: getLogger(),
    // requestIdMiddleware runs first and sets this header.
    genReqId: (_req, res) => {
      const requestId = res.getHeader('x-request-id');
      return typeof requestId === 'string' ? requestId : randomUUID();
    },
    autoLogging: { ignore: (req) => req.url === '/api/v1/health' },
  });
}
