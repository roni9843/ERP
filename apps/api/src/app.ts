import { apiReference } from '@scalar/express-api-reference';
import cors from 'cors';
import express, { type Express } from 'express';
import { getConfig } from './config/env';
import { errorHandler, notFoundHandler } from './core/http/middleware/error-handler';
import { createHttpLogger } from './core/http/middleware/http-logger';
import { requestContextMiddleware } from './core/http/middleware/request-context';
import { requestIdMiddleware } from './core/http/middleware/request-id';
import { securityHeaders } from './core/http/middleware/security-headers';
import { getOpenApiDocument } from './core/openapi/registry';
import { appModules } from './modules';

/**
 * Builds the Express application without starting a server, so tests can drive it with Supertest.
 * Order matters: request id → logging → security → body parsing → request context → routes → errors.
 */
export function createApp(): Express {
  const config = getConfig();
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(requestIdMiddleware);
  app.use(createHttpLogger());
  app.use(securityHeaders);
  app.use(cors({ origin: config.corsOrigins, credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(requestContextMiddleware);

  const api = express.Router();
  for (const module of appModules) {
    api.use(module.basePath, module.router);
  }
  app.use('/api/v1', api);

  app.get('/api/openapi.json', (_req, res) => {
    res.json(getOpenApiDocument());
  });
  app.use('/api/docs', apiReference({ url: '/api/openapi.json' }));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
