import type { AppModule } from '../core/modules/app-module';
import { authModule } from './identity/auth';
import { clientsModule } from './crm/clients';
import { healthModule } from './health';

/**
 * Every feature module mounted by the app, in order.
 * To add one: create it under src/modules/<area>/<feature>/ and list it here.
 * The planned modules are described in ./README.md and docs/domain/module-catalog.md.
 */
export const appModules: readonly AppModule[] = [healthModule, authModule, clientsModule];
