/**
 * @erp/shared: code used by both the API and the web app.
 *
 * Rule of thumb: put something here when the browser and the server must agree on it
 * (validation, DTO shapes, permission names, money and tax math). Keep it framework-free.
 */
export * from './constants/currencies';
export * from './constants/tax';
export * from './money/decimal';
export * from './tax/line-calculator';
export * from './permissions/catalog';
export * from './schemas/common';
export * from './schemas/auth';
export * from './schemas/crm/client';
export * from './types/api';
