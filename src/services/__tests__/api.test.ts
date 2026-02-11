import { describe, it, expect, vi, beforeEach } from 'vitest';
import { API_BASE_URL, getSuggestion } from '../api';

describe('api', () => {
  describe('API_BASE_URL', () => {
    it('is a non-empty string', () => {
      expect(typeof API_BASE_URL).toBe('string');
      expect(API_BASE_URL.length).toBeGreaterThan(0);
    });
  });

  describe('getSuggestion', () => {
    beforeEach(() => {
      vi.stubGlobal('fetch', vi.fn());
    });

    it('calls fetch with correct URL, method, headers and body', async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ recommended: 'up', reasoning: 'Move up.' }),
      } as Response);

      await getSuggestion([
        [2, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ]);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/prompt`,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            boardValues: [
              [2, null, null, null],
              [null, null, null, null],
              [null, null, null, null],
              [null, null, null, null],
            ],
          }),
        })
      );
    });

    it('returns recommended and reasoning on success', async () => {
      const mockFetch = vi.mocked(fetch);
      const data = { recommended: 'left', reasoning: 'Try left.' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(data),
      } as Response);

      const result = await getSuggestion([]);

      expect(result).toEqual(data);
      expect(result.recommended).toBe('left');
      expect(result.reasoning).toBe('Try left.');
    });

    it('throws when response is not ok', async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({ ok: false } as Response);

      await expect(getSuggestion([])).rejects.toThrow('Failed to fetch suggestion');
    });
  });
});
