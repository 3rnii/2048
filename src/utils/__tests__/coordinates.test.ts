import { describe, it, expect, vi, afterEach } from 'vitest';
import { getRandomCoordinate, coordinatesEqual } from '../coordinates';

describe('getRandomCoordinate', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns a tuple of two numbers', () => {
    const result = getRandomCoordinate();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
    expect(typeof result[0]).toBe('number');
    expect(typeof result[1]).toBe('number');
  });
});

describe('coordinatesEqual', () => {
  it('returns true when both coordinates are the same', () => {
    expect(coordinatesEqual([0, 0], [0, 0])).toBe(true);
    expect(coordinatesEqual([2, 3], [2, 3])).toBe(true);
    expect(coordinatesEqual([1, 1], [1, 1])).toBe(true);
  });

  it('returns false when first element differs', () => {
    expect(coordinatesEqual([0, 1], [1, 1])).toBe(false);
    expect(coordinatesEqual([3, 2], [0, 2])).toBe(false);
  });

  it('returns false when second element differs', () => {
    expect(coordinatesEqual([1, 0], [1, 1])).toBe(false);
    expect(coordinatesEqual([2, 3], [2, 0])).toBe(false);
  });

  it('returns false when both elements differ', () => {
    expect(coordinatesEqual([0, 0], [1, 1])).toBe(false);
    expect(coordinatesEqual([2, 3], [0, 1])).toBe(false);
  });
});
