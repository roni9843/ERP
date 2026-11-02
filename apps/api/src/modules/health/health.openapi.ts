import { z } from 'zod';
import { jsonContent, openApiRegistry } from '../../core/openapi/registry';

const healthSchema = z.object({
  status: z.enum(['ok', 'degraded']),
  database: z.enum(['up', 'down']),
  uptimeSeconds: z.number().int(),
});

openApiRegistry.registerPath({
  method: 'get',
  path: '/health',
  tags: ['System'],
  summary: 'Health check',
  responses: {
    200: { description: 'Service is healthy', content: jsonContent(healthSchema) },
    503: { description: 'Database unavailable', content: jsonContent(healthSchema) },
  },
});
