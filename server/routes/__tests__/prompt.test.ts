import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handlePostPrompt, sanitizeAndParseJson } from '../prompt.js';
import * as openai from '../../service/openai.js';

vi.mock('../../service/openai.js', () => ({
  promptModel: vi.fn(),
}));

const validBoard: (number | null)[][] = [
  [2, null, null, null],
  [null, 2, null, null],
  [null, null, null, null],
  [null, null, null, null],
];

const mockRes = () => {
  const res: {
    statusCode?: number;
    body?: unknown;
    status: (code: number) => typeof res;
    json: (body: unknown) => void;
  } = {
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

const mockReq = (body: unknown) => {
  return { body } as never;
}

describe('sanitizeAndParseJson', () => {
  it('parses plain JSON string', () => {
    expect(sanitizeAndParseJson('{"a":1}')).toEqual({ a: 1 });
  });

  it('strips ```json wrapper and parses', () => {
    expect(sanitizeAndParseJson('```json\n{"recommended":"UP"}\n```')).toEqual({ recommended: 'UP' });
  });

  it('strips ``` only wrapper', () => {
    expect(sanitizeAndParseJson('```\n{"x":1}\n```')).toEqual({ x: 1 });
  });

  it('throws on invalid JSON', () => {
    expect(() => sanitizeAndParseJson('not json')).toThrowError();
  });
});

describe('POST /prompt handler (handlePostPrompt)', () => {
  beforeEach(() => {
    vi.mocked(openai.promptModel).mockReset();
  });

  it('returns 200 and parsed JSON when promptModel returns valid JSON', async () => {
    vi.mocked(openai.promptModel).mockResolvedValue(
      JSON.stringify({ recommended: 'UP', reasoning: 'Keep the high tile in the corner.' })
    );

    const req = mockReq({ boardValues: validBoard });
    const res = mockRes();

    await handlePostPrompt(req, res as never);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ recommended: 'UP', reasoning: 'Keep the high tile in the corner.' });
    expect(openai.promptModel).toHaveBeenCalledTimes(1);
    expect(openai.promptModel).toHaveBeenCalledWith(validBoard);
  });

  it('strips markdown code blocks from response before parsing', async () => {
    vi.mocked(openai.promptModel).mockResolvedValue(
      '```json\n{"recommended": "LEFT", "reasoning": "Merge tiles."}\n```'
    );

    const req = mockReq({ boardValues: validBoard });
    const res = mockRes();

    await handlePostPrompt(req, res as never);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ recommended: 'LEFT', reasoning: 'Merge tiles.' });
  });

  it('returns 400 when body is missing boardValues', async () => {
    const req = mockReq({});
    const res = mockRes();

    await handlePostPrompt(req, res as never);

    expect(res.statusCode).toBe(400);
    expect((res.body as { error?: string }).error).toContain('boardValues');
    expect(openai.promptModel).not.toHaveBeenCalled();
  });

  it('returns 400 when boardValues is not a 4x4 array', async () => {
    const req = mockReq({ boardValues: [[1, 2], [3, 4]] });
    const res = mockRes();

    await handlePostPrompt(req, res as never);

    expect(res.statusCode).toBe(400);
    expect((res.body as { error?: string }).error).toContain('boardValues');
    expect(openai.promptModel).not.toHaveBeenCalled();
  });

  it('returns 400 when boardValues contains invalid cell types', async () => {
    const req = mockReq({
      boardValues: [
        ['a', null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ],
    });
    const res = mockRes();

    await handlePostPrompt(req, res as never);

    expect(res.statusCode).toBe(400);
    expect(openai.promptModel).not.toHaveBeenCalled();
  });

  it('returns 500 when promptModel throws', async () => {
    vi.mocked(openai.promptModel).mockRejectedValue(new Error('API error'));

    const req = mockReq({ boardValues: validBoard });
    const res = mockRes();

    await handlePostPrompt(req, res as never);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Failed to generate prompt response' });
  });

  it('returns 500 when promptModel returns invalid JSON', async () => {
    vi.mocked(openai.promptModel).mockResolvedValue('not json at all');

    const req = mockReq({ boardValues: validBoard });
    const res = mockRes();

    await handlePostPrompt(req, res as never);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Failed to generate prompt response' });
  });
});
