import { Router } from 'express';
import { isDatabaseConnected } from '../../core/database/connection';

export const healthRouter = Router();

/** Liveness and readiness probe for load balancers and uptime monitors. */
healthRouter.get('/', (_req, res) => {
  const databaseUp = isDatabaseConnected();
  res.status(databaseUp ? 200 : 503).json({
    status: databaseUp ? 'ok' : 'degraded',
    database: databaseUp ? 'up' : 'down',
    uptimeSeconds: Math.round(process.uptime()),
  });
});
