import { ERROR_CODES, type ApiErrorBody } from '@erp/shared';
import type { ErrorRequestHandler, RequestHandler, Response } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { requestContext } from '../../context/request-context';
import { AppError } from '../../errors/app-error';
import { getLogger } from '../../logger/logger';
import { getRequestId } from './request-id';

function send(
  res: Response,
  status: number,
  code: string,
  message: string,
  details?: unknown,
): void {
  const body: ApiErrorBody = {
    error: {
      code,
      message,
      ...(details === undefined ? {} : { details }),
      requestId: requestContext.get()?.requestId ?? getRequestId(res.locals),
    },
  };
  res.status(status).json(body);
}

function isDuplicateKeyError(
  err: unknown,
): err is { code: 11000; keyValue?: Record<string, unknown> } {
  return typeof err === 'object' && err !== null && (err as { code?: unknown }).code === 11000;
}

function isBodyParseError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    (err as { type?: unknown }).type === 'entity.parse.failed'
  );
}

/** Maps every error to the documented error envelope. Unknown errors become 500 and are logged. */
export const errorHandler: ErrorRequestHandler = (err: unknown, _req, res, _next) => {
  if (err instanceof AppError) {
    send(res, err.status, err.code, err.message, err.details);
    return;
  }
  if (err instanceof ZodError) {
    send(
      res,
      422,
      ERROR_CODES.VALIDATION_ERROR,
      'Request validation failed',
      err.issues.map((issue) => ({
        path: issue.path.map(String).join('.'),
        message: issue.message,
        code: issue.code,
      })),
    );
    return;
  }
  if (isBodyParseError(err)) {
    send(res, 400, ERROR_CODES.INVALID_JSON, 'Malformed JSON body');
    return;
  }
  if (isDuplicateKeyError(err)) {
    send(res, 409, ERROR_CODES.CONFLICT, 'A record with the same unique value already exists', {
      fields: Object.keys(err.keyValue ?? {}),
    });
    return;
  }
  if (err instanceof mongoose.Error.CastError) {
    send(res, 400, ERROR_CODES.VALIDATION_ERROR, `Invalid value for "${err.path}"`);
    return;
  }
  if (err instanceof mongoose.Error.ValidationError) {
    send(
      res,
      422,
      ERROR_CODES.VALIDATION_ERROR,
      'Validation failed',
      Object.values(err.errors).map((e) => ({ path: e.path, message: e.message })),
    );
    return;
  }

  getLogger().error({ err }, 'Unhandled error');
  send(res, 500, ERROR_CODES.INTERNAL_ERROR, 'Something went wrong. Please try again later.');
};

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(AppError.notFound(`Route ${req.method} ${req.path}`));
};
