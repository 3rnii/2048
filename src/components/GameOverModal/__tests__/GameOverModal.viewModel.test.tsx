/**
 * @vitest-environment happy-dom
 */
/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { GameContext } from '../../../contexts/game/context';
import useGameOverModalViewModel from '../GameOverModal.viewModel';

const mockResetGame = vi.fn();

function createMockContextValue(overrides: Record<string, unknown> = {}) {
  return {
    startGame: vi.fn(),
    getTiles: () => [],
    getTileAtPosition: vi.fn(),
    getCurrentBoardValues: () => [] as (number | null)[][],
    hasMoved: false,
    move: vi.fn(),
    status: 'new' as const,
    resetGame: mockResetGame,
    setLock: vi.fn(),
    isLocked: false,
    ...overrides,
  };
}

function TestHost({ contextValue: _cv }: { contextValue: ReturnType<typeof createMockContextValue> }) {
  const vm = useGameOverModalViewModel();
  return (
    <div data-testid="vm-host" data-display={String(vm.display)} data-title-color={vm.titleColor}>
      {vm.display && (
        <>
          <span data-testid="title">{vm.text.title}</span>
          <span data-testid="message">{vm.text.message}</span>
          <button type="button" onClick={vm.resetGame}>
            Reset
          </button>
          <div onKeyDown={vm.handleKeyDown} tabIndex={-1} data-testid="keydown-target">
            keydown here
          </div>
        </>
      )}
    </div>
  );
}

describe('GameOverModal viewModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  describe('display', () => {
    it('is true when status is won', () => {
      const contextValue = createMockContextValue({ status: 'won' });
      render(
        <GameContext.Provider value={contextValue}>
          <TestHost contextValue={contextValue} />
        </GameContext.Provider>
      );
      expect(screen.getByTestId('vm-host')).toHaveAttribute('data-display', 'true');
      expect(screen.getByTestId('title')).toHaveTextContent('🎉 You Won! 🎉');
    });

    it('is true when status is lost', () => {
      const contextValue = createMockContextValue({ status: 'lost' });
      render(
        <GameContext.Provider value={contextValue}>
          <TestHost contextValue={contextValue} />
        </GameContext.Provider>
      );
      expect(screen.getByTestId('vm-host')).toHaveAttribute('data-display', 'true');
      expect(screen.getByTestId('title')).toHaveTextContent('😢 Game Over 😢');
    });

    it('is false when status is new', () => {
      const contextValue = createMockContextValue({ status: 'new' });
      render(
        <GameContext.Provider value={contextValue}>
          <TestHost contextValue={contextValue} />
        </GameContext.Provider>
      );
      expect(screen.getByTestId('vm-host')).toHaveAttribute('data-display', 'false');
      expect(screen.queryByTestId('title')).not.toBeInTheDocument();
    });

    it('is false when status is playing', () => {
      const contextValue = createMockContextValue({ status: 'playing' });
      render(
        <GameContext.Provider value={contextValue}>
          <TestHost contextValue={contextValue} />
        </GameContext.Provider>
      );
      expect(screen.getByTestId('vm-host')).toHaveAttribute('data-display', 'false');
    });
  });

  describe('resetGame', () => {
    it('is called when reset button is clicked', () => {
      const contextValue = createMockContextValue({ status: 'won' });
      render(
        <GameContext.Provider value={contextValue}>
          <TestHost contextValue={contextValue} />
        </GameContext.Provider>
      );
      screen.getByRole('button', { name: 'Reset' }).click();
      expect(mockResetGame).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleKeyDown', () => {
    it('calls preventDefault and stopPropagation on the event', () => {
      const contextValue = createMockContextValue({ status: 'won' });
      render(
        <GameContext.Provider value={contextValue}>
          <TestHost contextValue={contextValue} />
        </GameContext.Provider>
      );
      const keydownTarget = screen.getByTestId('keydown-target');
      const ev = new KeyboardEvent('keydown', { bubbles: true });
      const preventDefault = vi.spyOn(ev, 'preventDefault');
      const stopPropagation = vi.spyOn(ev, 'stopPropagation');
      keydownTarget.dispatchEvent(ev);
      expect(preventDefault).toHaveBeenCalled();
      expect(stopPropagation).toHaveBeenCalled();
    });
  });
});
