import type { AppModule } from '../../core/modules/app-module';
import './health.openapi';
import { healthRouter } from './health.routes';

export const healthModule: AppModule = {
  name: 'health',
  basePath: '/health',
  router: healthRouter,
};
