import mongoose, { type ClientSession } from 'mongoose';

/**
 * Runs `fn` inside a MongoDB transaction. The driver retries transient errors.
 *
 * Because `transactionAsyncLocalStorage` is enabled (see connection.ts), every Mongoose operation
 * awaited inside `fn` joins the transaction automatically. You do not need to pass `session`.
 *
 * Use this for anything that must be all-or-nothing: posting an invoice together with its
 * journal entry and stock movements, signing up a tenant with its owner, and so on.
 */
export function withTransaction<T>(fn: (session: ClientSession) => Promise<T>): Promise<T> {
  return mongoose.connection.transaction(fn);
}
