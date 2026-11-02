import type { AppModule } from '../../../core/modules/app-module';
import './client.openapi';
import { clientsRouter } from './client.routes';

/**
 * Reference module: copy this folder's structure when you add a new feature module.
 * model → service → controller → routes → openapi → index (module definition) → __tests__.
 */
export const clientsModule: AppModule = {
  name: 'crm-clients',
  basePath: '/crm/clients',
  router: clientsRouter,
};
