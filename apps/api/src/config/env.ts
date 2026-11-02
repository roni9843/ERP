import { existsSync } from 'node:fs';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_ACCESS_TTL: z
    .string()
    .regex(/^\d+[smhd]$/, 'JWT_ACCESS_TTL must look like 15m, 1h or 7d')
    .default('15m'),
  CORS_ORIGINS: z.string().default('http://localhost:5173'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
});

export interface AppConfig {
  nodeEnv: 'development' | 'test' | 'production';
  isProduction: boolean;
  isTest: boolean;
  port: number;
  mongodbUri: string;
  jwt: { accessSecret: string; accessTtl: string };
  corsOrigins: string[];
  logLevel: z.infer<typeof envSchema>['LOG_LEVEL'];
}

let cachedConfig: AppConfig | undefined;

/** Loads `.env` from the working directory in development (Node's built-in loader, no dotenv). */
export function loadEnvFile(path = '.env'): void {
  if (process.env.NODE_ENV !== 'production' && existsSync(path)) {
    process.loadEnvFile(path);
  }
}

/** Validated configuration, parsed lazily on first use and cached. */
export function getConfig(): AppConfig {
  if (cachedConfig) return cachedConfig;

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.map(String).join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid environment variables:\n${issues}`);
  }

  const env = parsed.data;
  cachedConfig = {
    nodeEnv: env.NODE_ENV,
    isProduction: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test',
    port: env.PORT,
    mongodbUri: env.MONGODB_URI,
    jwt: { accessSecret: env.JWT_ACCESS_SECRET, accessTtl: env.JWT_ACCESS_TTL },
    corsOrigins: env.CORS_ORIGINS.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    logLevel: env.LOG_LEVEL,
  };
  return cachedConfig;
}
