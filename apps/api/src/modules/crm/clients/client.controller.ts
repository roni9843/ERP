import {
  clientCreateSchema,
  clientListQuerySchema,
  clientUpdateSchema,
  objectIdSchema,
} from '@erp/shared';
import type { RequestHandler } from 'express';
import * as clientService from './client.service';

/**
 * Controllers translate HTTP into service calls: parse and validate input with the shared Zod
 * schemas (a ZodError becomes a 422 automatically), call the service, and shape the response.
 */

export const listClientsHandler: RequestHandler = async (req, res) => {
  const query = clientListQuerySchema.parse(req.query);
  res.json(await clientService.listClients(query));
};

export const getClientHandler: RequestHandler = async (req, res) => {
  const id = objectIdSchema.parse(req.params.id);
  res.json(await clientService.getClient(id));
};

export const createClientHandler: RequestHandler = async (req, res) => {
  const input = clientCreateSchema.parse(req.body);
  const client = await clientService.createClient(input);
  res.status(201).location(`${req.baseUrl}/${client.id}`).json(client);
};

export const updateClientHandler: RequestHandler = async (req, res) => {
  const id = objectIdSchema.parse(req.params.id);
  const input = clientUpdateSchema.parse(req.body);
  res.json(await clientService.updateClient(id, input));
};

export const deleteClientHandler: RequestHandler = async (req, res) => {
  const id = objectIdSchema.parse(req.params.id);
  await clientService.deleteClient(id);
  res.status(204).end();
};
