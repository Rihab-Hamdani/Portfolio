import axios, { AxiosError } from 'axios';
import { site } from '@/config/site';
import type { ApiErrorBody } from '@/types';

export const TOKEN_KEY = 'portfolio.admin.token';

/** Normalised error thrown by every API call, so UI code never deals with raw Axios errors. */
export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: Record<string, string>;
  readonly retryAfter?: number;

  constructor(status: number, message: string, fieldErrors: Record<string, string> = {}, retryAfter?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
    this.retryAfter = retryAfter;
  }
}

const FRIENDLY: Record<number, string> = {
  0: 'Could not reach the server. Check your connection and try again.',
  400: 'Some information is invalid. Please check the form.',
  401: 'Your session has expired. Please sign in again.',
  403: 'You do not have permission to do that.',
  404: 'We could not find what you were looking for.',
  409: 'This conflicts with existing data.',
  429: 'Too many requests. Please wait a moment and try again.',
  500: 'Something went wrong on our side. Please try again later.',
};

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorBody>;
    const status = axiosError.response?.status ?? 0;
    const body = axiosError.response?.data;
    const retryHeader = axiosError.response?.headers?.['retry-after'];
    const retryAfter = retryHeader ? Number(retryHeader) : undefined;
    const serverMessage = body && typeof body === 'object' ? body.message : undefined;
    const message = serverMessage || FRIENDLY[status] || FRIENDLY[status >= 500 ? 500 : 400];
    const fieldErrors = body && typeof body === 'object' && body.fieldErrors ? body.fieldErrors : {};
    return new ApiError(status, message, fieldErrors, Number.isFinite(retryAfter) ? retryAfter : undefined);
  }
  return new ApiError(0, FRIENDLY[0]);
}

export const http = axios.create({
  baseURL: site.apiUrl,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

function readToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

http.interceptors.request.use((config) => {
  const token = readToken();
  if (token && config.url?.startsWith('/admin')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (token && config.url === '/auth/me') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type UnauthorizedListener = () => void;
const unauthorizedListeners = new Set<UnauthorizedListener>();

/** Lets the auth context react when the API reports an expired / invalid session. */
export function onUnauthorized(listener: UnauthorizedListener) {
  unauthorizedListeners.add(listener);
  return () => unauthorizedListeners.delete(listener);
}

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = toApiError(error);
    const url: string = error?.config?.url ?? '';
    if (apiError.status === 401 && (url.startsWith('/admin') || url === '/auth/me')) {
      unauthorizedListeners.forEach((listener) => listener());
    }
    return Promise.reject(apiError);
  },
);
