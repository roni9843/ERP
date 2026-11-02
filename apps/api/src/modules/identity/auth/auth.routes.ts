import { Router } from 'express';
import { authenticate } from '../../../core/http/middleware/authenticate';
import { authRateLimiter } from '../../../core/http/middleware/rate-limit';
import { loginHandler, meHandler, signupHandler } from './auth.controller';

export const authRouter = Router();

authRouter.post('/signup', authRateLimiter, signupHandler);
authRouter.post('/login', authRateLimiter, loginHandler);
authRouter.get('/me', authenticate, meHandler);
