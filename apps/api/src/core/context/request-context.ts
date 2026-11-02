import { AsyncLocalStorage } from 'node:async_hooks';
import type { SystemRole } from '@erp/shared';

export type Locale = 'ar' | 'en';

/**
 * Per-request state available anywhere down the call stack (services, Mongoose plugins, logs)
 * without passing it through every function. Backed by AsyncLocalStorage.
 */
export interface RequestContext {
  requestId: string;
  locale: Locale;
  tenantId?: string;
  userId?: string;
  role?: SystemRole;
}

const storage = new AsyncLocalStorage<RequestContext>();

export const requestContext = {
  run<T>(context: RequestContext, fn: () => T): T {
    return storage.run(context, fn);
  },

  get(): RequestContext | undefined {
    return storage.getStore();
  },

  /** Adds fields to the active context, for example after authentication. */
  assign(values: Partial<RequestContext>): void {
    const store = storage.getStore();
    if (!store) throw new Error('No request context is active');
    Object.assign(store, values);
  },
};
