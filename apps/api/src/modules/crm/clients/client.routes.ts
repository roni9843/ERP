import { PERMISSIONS } from '@erp/shared';
import { Router } from 'express';
import { authenticate } from '../../../core/http/middleware/authenticate';
import { authorize } from '../../../core/http/middleware/authorize';
import {
  createClientHandler,
  deleteClientHandler,
  getClientHandler,
  listClientsHandler,
  updateClientHandler,
} from './client.controller';

export const clientsRouter = Router();

clientsRouter.use(authenticate);

clientsRouter.get('/', authorize(PERMISSIONS.CRM_CLIENTS_READ), listClientsHandler);
clientsRouter.post('/', authorize(PERMISSIONS.CRM_CLIENTS_CREATE), createClientHandler);
clientsRouter.get('/:id', authorize(PERMISSIONS.CRM_CLIENTS_READ), getClientHandler);
clientsRouter.patch('/:id', authorize(PERMISSIONS.CRM_CLIENTS_UPDATE), updateClientHandler);
clientsRouter.delete('/:id', authorize(PERMISSIONS.CRM_CLIENTS_DELETE), deleteClientHandler);
