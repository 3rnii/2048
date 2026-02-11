import { describe, it, expect } from 'vitest';
import { getHealth } from '../health.js';

function mockRes() {
  const res: { statusCode?: number; body?: unknown; status: (code: number) => typeof res; json: (body: unknown) => void } = {
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(body: unknown) {
      this.body = body;
    },
  };
  return res;
}

describe('GET /health handler (getHealth)', () => {
  it('responds with 200 and { ok: true }', () => {
    const res = mockRes();
    getHealth({} as never, res as never);

    expect(res.body).toEqual({ ok: true });
    expect(res.statusCode).toBeUndefined(); // default 200 when not set
  });
});
