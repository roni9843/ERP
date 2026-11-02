import mongoose from 'mongoose';

// Reject query filters on fields that are not in the schema (catches typos and injection attempts).
mongoose.set('strictQuery', true);
// Every Mongoose call inside connection.transaction() joins the transaction automatically.
mongoose.set('transactionAsyncLocalStorage', true);

export async function connectDatabase(
  uri: string,
  options: { dbName?: string } = {},
): Promise<void> {
  await mongoose.connect(uri, {
    ...(options.dbName ? { dbName: options.dbName } : {}),
    serverSelectionTimeoutMS: 10_000,
  });
}

/**
 * Creates the collections and indexes of every registered model.
 * Run once at startup, before serving traffic: creating a collection inside a transaction can fail.
 */
export async function initModels(): Promise<void> {
  await Promise.all(Object.values(mongoose.connection.models).map((model) => model.init()));
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === mongoose.ConnectionStates.connected;
}
