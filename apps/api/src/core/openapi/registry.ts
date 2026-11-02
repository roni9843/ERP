import { OpenAPIRegistry, OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import { apiErrorSchema } from '@erp/shared';
import type { z } from 'zod';

/**
 * OpenAPI document generated from the same Zod schemas that validate requests,
 * so the docs cannot drift from the code. Each module registers its paths in `<feature>.openapi.ts`.
 * Served at /api/openapi.json and rendered at /api/docs.
 *
 * Reusable components come from Zod's native metadata: a schema declared with
 * `.meta({ id: 'Client' })` (see @erp/shared) becomes `#/components/schemas/Client`.
 * We deliberately do NOT use `extendZodWithOpenApi`/`.openapi()`: Zod 4 copies methods onto
 * schemas when they are created, so the extension would have to run before @erp/shared loads.
 */
export const openApiRegistry = new OpenAPIRegistry();

export const bearerAuth = openApiRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

export const securedRoute = [{ [bearerAuth.name]: [] }];

export function jsonContent<T extends z.ZodType>(schema: T) {
  return { 'application/json': { schema } };
}

export function errorResponse(description: string) {
  return { description, content: jsonContent(apiErrorSchema) };
}

let cachedDocument: ReturnType<OpenApiGeneratorV31['generateDocument']> | undefined;

export function getOpenApiDocument() {
  cachedDocument ??= new OpenApiGeneratorV31(openApiRegistry.definitions).generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'ERP Platform API',
      version: '0.1.0',
      description:
        'Multi-tenant ERP API. Authenticate with `POST /auth/login` (or `/auth/signup`) and send ' +
        'the access token as `Authorization: Bearer <token>`. Amounts are decimal strings.',
    },
    servers: [{ url: '/api/v1' }],
  });
  return cachedDocument;
}
