import type { ApiErrorBody } from '@erp/shared';
import axios from 'axios';

/** Extracts the API's human-readable message from an error, with a fallback. */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.error.message ?? fallback;
  }
  return fallback;
}

/** True for 4xx answers, which retrying will not fix. */
export function isClientError(error: unknown): boolean {
  if (!axios.isAxiosError(error) || !error.response) return false;
  return error.response.status >= 400 && error.response.status < 500;
}
