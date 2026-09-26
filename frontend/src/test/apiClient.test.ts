import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';
import { ApiError, toApiError } from '@/api/client';

function axiosError(status: number, data: unknown, headers: Record<string, string> = {}) {
  const config = { headers: new AxiosHeaders() };
  return new AxiosError('Request failed', 'ERR', config as never, {}, {
    status,
    statusText: '',
    data,
    headers,
    config: config as never,
  });
}

describe('toApiError', () => {
  it('keeps the server message and field errors from structured responses', () => {
    const error = toApiError(axiosError(400, { status: 400, message: 'Some fields are invalid.', fieldErrors: { email: 'Invalid' } }));
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(400);
    expect(error.message).toBe('Some fields are invalid.');
    expect(error.fieldErrors).toEqual({ email: 'Invalid' });
  });

  it('reads Retry-After for rate-limited responses', () => {
    const error = toApiError(axiosError(429, { status: 429 }, { 'retry-after': '120' }));
    expect(error.status).toBe(429);
    expect(error.retryAfter).toBe(120);
    expect(error.message).toMatch(/Too many requests/);
  });

  it('uses a friendly message when the server gives none', () => {
    expect(toApiError(axiosError(503, '<html>')).message).toMatch(/went wrong on our side/);
  });

  it('treats network failures as status 0', () => {
    const error = toApiError(new AxiosError('Network Error', 'ERR_NETWORK'));
    expect(error.status).toBe(0);
    expect(error.message).toMatch(/Could not reach the server/);
  });
});
