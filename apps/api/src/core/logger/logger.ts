import { pino, type Logger } from 'pino';
import { getConfig } from '../../config/env';

let logger: Logger | undefined;

/** Structured JSON logger (pretty-printed in development). Secrets are redacted. */
export function getLogger(): Logger {
  if (logger) return logger;

  const config = getConfig();
  logger = pino({
    level: config.logLevel,
    base: { service: 'erp-api' },
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        '*.password',
        '*.passwordHash',
        '*.accessToken',
      ],
      censor: '[redacted]',
    },
    ...(config.nodeEnv === 'development'
      ? {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:HH:MM:ss',
              ignore: 'pid,hostname,service',
            },
          },
        }
      : {}),
  });
  return logger;
}
