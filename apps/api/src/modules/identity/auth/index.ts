import type { AppModule } from '../../../core/modules/app-module';
import './auth.openapi';
import { authRouter } from './auth.routes';

export const authModule: AppModule = {
  name: 'identity-auth',
  basePath: '/auth',
  router: authRouter,
};
