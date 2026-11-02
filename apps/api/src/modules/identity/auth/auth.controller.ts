import { loginSchema, signupSchema } from '@erp/shared';
import type { RequestHandler } from 'express';
import * as authService from './auth.service';

export const signupHandler: RequestHandler = async (req, res) => {
  const input = signupSchema.parse(req.body);
  res.status(201).json(await authService.signup(input));
};

export const loginHandler: RequestHandler = async (req, res) => {
  const input = loginSchema.parse(req.body);
  res.json(await authService.login(input));
};

export const meHandler: RequestHandler = async (_req, res) => {
  res.json(await authService.getCurrentUser());
};
