import { describe, it, expect } from 'vitest';
import { noop } from '../index';

describe('noop', () => {
  it('is a function', () => {
    expect(typeof noop).toBe('function');
  });

  it('returns undefined when called', () => {
    expect(noop()).toBeUndefined();
  });

  it('can be called with any arguments without throwing', () => {
    expect(() => noop()).not.toThrow();
    expect(() => noop(1, 'a', null, {})).not.toThrow();
  });
});
