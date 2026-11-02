import { ERROR_CODES } from '@erp/shared';

/**
 * An expected, client-facing error. The error handler turns it into
 * `{ error: { code, message, details, requestId } }` with the given HTTP status.
 * Anything that is not an AppError is treated as a 500 and logged.
 */
export class AppError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static unauthorized(message = 'Authentication required'): AppError {
    return new AppError(401, ERROR_CODES.UNAUTHORIZED, message);
  }

  static forbidden(message = 'You do not have permission to perform this action'): AppError {
    return new AppError(403, ERROR_CODES.FORBIDDEN, message);
  }

  static notFound(resource = 'Resource'): AppError {
    return new AppError(404, ERROR_CODES.NOT_FOUND, `${resource} not found`);
  }

  static conflict(
    message: string,
    code: string = ERROR_CODES.CONFLICT,
    details?: unknown,
  ): AppError {
    return new AppError(409, code, message, details);
  }
}
