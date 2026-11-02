import {
  clientCreateSchema,
  clientDtoSchema,
  clientListQuerySchema,
  clientUpdateSchema,
  objectIdSchema,
  paginatedSchema,
} from '@erp/shared';
import { z } from 'zod';
import {
  errorResponse,
  jsonContent,
  openApiRegistry,
  securedRoute,
} from '../../../core/openapi/registry';

const Client = clientDtoSchema;
const idParams = z.object({ id: objectIdSchema });
const tags = ['CRM / Clients'];

openApiRegistry.registerPath({
  method: 'get',
  path: '/crm/clients',
  tags,
  summary: 'List clients (paginated, searchable)',
  security: securedRoute,
  request: { query: clientListQuerySchema },
  responses: {
    200: { description: 'A page of clients', content: jsonContent(paginatedSchema(Client)) },
    401: errorResponse('Not authenticated'),
    403: errorResponse('Missing permission crm.clients.read'),
  },
});

openApiRegistry.registerPath({
  method: 'post',
  path: '/crm/clients',
  tags,
  summary: 'Create a client',
  security: securedRoute,
  request: { body: { content: jsonContent(clientCreateSchema) } },
  responses: {
    201: { description: 'Created', content: jsonContent(Client) },
    422: errorResponse('Validation failed'),
  },
});

openApiRegistry.registerPath({
  method: 'get',
  path: '/crm/clients/{id}',
  tags,
  summary: 'Get a client',
  security: securedRoute,
  request: { params: idParams },
  responses: {
    200: { description: 'The client', content: jsonContent(Client) },
    404: errorResponse('Not found (or belongs to another tenant)'),
  },
});

openApiRegistry.registerPath({
  method: 'patch',
  path: '/crm/clients/{id}',
  tags,
  summary: 'Update a client (partial)',
  security: securedRoute,
  request: { params: idParams, body: { content: jsonContent(clientUpdateSchema) } },
  responses: {
    200: { description: 'Updated', content: jsonContent(Client) },
    404: errorResponse('Not found'),
    422: errorResponse('Validation failed'),
  },
});

openApiRegistry.registerPath({
  method: 'delete',
  path: '/crm/clients/{id}',
  tags,
  summary: 'Delete a client',
  security: securedRoute,
  request: { params: idParams },
  responses: {
    204: { description: 'Deleted' },
    404: errorResponse('Not found'),
  },
});
