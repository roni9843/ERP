import {
  authSessionSchema,
  loginSchema,
  signupSchema,
  tenantDtoSchema,
  userDtoSchema,
} from '@erp/shared';
import { z } from 'zod';
import {
  errorResponse,
  jsonContent,
  openApiRegistry,
  securedRoute,
} from '../../../core/openapi/registry';

const AuthSession = authSessionSchema;
const meResponseSchema = z.object({ user: userDtoSchema, tenant: tenantDtoSchema });

openApiRegistry.registerPath({
  method: 'post',
  path: '/auth/signup',
  tags: ['Auth'],
  summary: 'Create a company account and its owner',
  request: { body: { content: jsonContent(signupSchema) } },
  responses: {
    201: { description: 'Account created; returns a session', content: jsonContent(AuthSession) },
    409: errorResponse('Email already registered'),
    422: errorResponse('Validation failed'),
  },
});

openApiRegistry.registerPath({
  method: 'post',
  path: '/auth/login',
  tags: ['Auth'],
  summary: 'Log in with email and password',
  request: { body: { content: jsonContent(loginSchema) } },
  responses: {
    200: { description: 'Logged in', content: jsonContent(AuthSession) },
    401: errorResponse('Invalid credentials'),
    429: errorResponse('Too many attempts'),
  },
});

openApiRegistry.registerPath({
  method: 'get',
  path: '/auth/me',
  tags: ['Auth'],
  summary: 'Current user and company',
  security: securedRoute,
  responses: {
    200: { description: 'Current session', content: jsonContent(meResponseSchema) },
    401: errorResponse('Not authenticated'),
  },
});
