import { createApp } from './app';
import { getConfig, loadEnvFile } from './config/env';
import { connectDatabase, disconnectDatabase, initModels } from './core/database/connection';
import { getLogger } from './core/logger/logger';

loadEnvFile();
const config = getConfig();
const logger = getLogger();

await connectDatabase(config.mongodbUri);
await initModels();
logger.info('Connected to MongoDB');

const app = createApp();
const server = app.listen(config.port, (error?: Error) => {
  if (error) {
    logger.fatal({ err: error }, 'Failed to start HTTP server');
    process.exit(1);
  }
  logger.info(`API listening on http://localhost:${config.port} (docs: /api/docs)`);
});

async function shutdown(signal: string): Promise<void> {
  logger.info({ signal }, 'Shutting down gracefully');
  server.close();
  await disconnectDatabase();
  process.exit(0);
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('unhandledRejection', (reason) => {
  logger.fatal({ err: reason }, 'Unhandled promise rejection');
  process.exit(1);
});
