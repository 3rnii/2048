import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const createMock = vi.fn();

vi.mock('openai', () => ({
  default: class MockOpenAI {
    chat = {
      completions: {
        create: createMock,
      },
    };
  },
}));

describe('openai service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv, POE_API_KEY: 'test-key' };
    createMock.mockReset();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('userPrompt (unit)', () => {
    it('includes the stringified grid in the message', async () => {
      const { userPrompt } = await import('./openai.js');
      const grid: (number | null)[][] = [
        [2, null, null, null],
        [null, 4, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ];
      const message = userPrompt(grid);
      expect(message).toContain(JSON.stringify(grid));
      expect(message).toContain('current board state');
      expect(message).toContain('recommend a move');
    });

    it('handles empty grid', async () => {
      const { userPrompt } = await import('./openai.js');
      const grid: (number | null)[][] = [
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ];
      const message = userPrompt(grid);
      expect(message).toContain(JSON.stringify(grid));
    });
  });

  describe('promptModel', () => {
    it('returns trimmed content from first choice', async () => {
      createMock.mockResolvedValue({
        choices: [{ message: { content: '  {"recommended":"UP","reasoning":"test"}  ' } }],
      });

      const { promptModel } = await import('./openai.js');
      const result = await promptModel([
        [2, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ]);

      expect(result).toBe('{"recommended":"UP","reasoning":"test"}');
      expect(createMock).toHaveBeenCalledTimes(1);
      const call = createMock.mock.calls[0][0];
      expect(call.model).toBe('gpt-4o');
      expect(call.messages).toHaveLength(2);
      expect(call.messages[0].role).toBe('system');
      expect(call.messages[1].role).toBe('user');
    });

    it('returns empty string when choices is empty', async () => {
      createMock.mockResolvedValue({ choices: [] });

      const { promptModel } = await import('./openai.js');
      const result = await promptModel([
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ]);

      expect(result).toBe('');
    });

    it('returns empty string when message content is null', async () => {
      createMock.mockResolvedValue({
        choices: [{ message: { content: null } }],
      });

      const { promptModel } = await import('./openai.js');
      const result = await promptModel([
        [2, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ]);

      expect(result).toBe('');
    });

    it('throws when POE_API_KEY is not set', async () => {
      delete process.env.POE_API_KEY;
      const { promptModel } = await import('./openai.js');

      await expect(
        promptModel([
          [2, null, null, null],
          [null, null, null, null],
          [null, null, null, null],
          [null, null, null, null],
        ])
      ).rejects.toThrow('POE_API_KEY environment variable is not set');
    });

    it('propagates errors from the API', async () => {
      createMock.mockRejectedValue(new Error('Rate limit exceeded'));

      const { promptModel } = await import('./openai.js');

      await expect(
        promptModel([
          [2, null, null, null],
          [null, null, null, null],
          [null, null, null, null],
          [null, null, null, null],
        ])
      ).rejects.toThrow('Rate limit exceeded');
    });
  });
});
