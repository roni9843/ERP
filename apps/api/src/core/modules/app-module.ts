import type { Router } from 'express';

/**
 * Contract every feature module implements. The app mounts `router` at `/api/v1${basePath}`.
 * A module registers its OpenAPI paths as a side effect of importing its `<feature>.openapi.ts`.
 */
export interface AppModule {
  /** Unique, kebab-case name, for example "crm-clients". */
  name: string;
  /** Mount path under /api/v1, for example "/crm/clients". */
  basePath: string;
  router: Router;
}
