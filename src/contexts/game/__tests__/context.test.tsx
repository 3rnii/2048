import { describe, it, expect } from 'vitest';
import { GameContext, GameProvider } from '../context';

describe('GameContext', () => {
  it('GameContext and GameProvider are defined', () => {
    expect(GameContext).toBeDefined();
    expect(GameContext.Provider).toBeDefined();
    expect(GameProvider).toBeDefined();
    expect(typeof GameProvider).toBe('function');
  });
});
