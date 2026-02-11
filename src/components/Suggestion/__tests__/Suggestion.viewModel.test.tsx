/**
 * @vitest-environment happy-dom
 */
/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { GameContext } from '../../../contexts/game/context';
import useSuggestionViewModel from '../Suggestion.viewModel';

vi.mock('../../../services/api', () => ({
  getSuggestion: vi.fn(),
}));

const mockGetCurrentBoardValues = vi.fn();
const mockSetLock = vi.fn();

function createMockContextValue(overrides: Record<string, unknown> = {}) {
  return {
    startGame: vi.fn(),
    getTiles: () => [],
    getTileAtPosition: vi.fn(),
    getCurrentBoardValues: mockGetCurrentBoardValues,
    hasMoved: false,
    move: vi.fn(),
    status: 'new' as const,
    resetGame: vi.fn(),
    setLock: mockSetLock,
    isLocked: false,
    ...overrides,
  };
}

function TestHost({ contextValue: _cv }: { contextValue: ReturnType<typeof createMockContextValue> }) {
  const vm = useSuggestionViewModel();
  return (
    <div data-testid="vm-host">
      <button type="button" onClick={vm.onClick} data-testid="on-click">
        Get suggestion
      </button>
      <span data-testid="loading">{String(vm.loading)}</span>
      <span data-testid="has-response">{String(vm.hasResponse)}</span>
      <span data-testid="recommended">{vm.text.recommended}</span>
      <span data-testid="reasoning">{vm.text.reasoning}</span>
    </div>
  );
}

describe('Suggestion viewModel', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    mockGetCurrentBoardValues.mockReturnValue([
      [2, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]);
    cleanup();
  });

  describe('initial state', () => {
    it('has loading false and hasResponse false', () => {
      const contextValue = createMockContextValue();
      render(
        <GameContext.Provider value={contextValue}>
          <TestHost contextValue={contextValue} />
        </GameContext.Provider>
      );
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
      expect(screen.getByTestId('has-response')).toHaveTextContent('false');
    });
  });

  describe('onClick', () => {
    it('calls setLock(true) then getCurrentBoardValues and getSuggestion', async () => {
      const { getSuggestion } = await import('../../../services/api');
      vi.mocked(getSuggestion).mockResolvedValue({
        recommended: 'UP',
        reasoning: 'Move up to merge.',
      });

      const contextValue = createMockContextValue();
      render(
        <GameContext.Provider value={contextValue}>
          <TestHost contextValue={contextValue} />
        </GameContext.Provider>
      );

      screen.getByTestId('on-click').click();

      expect(mockSetLock).toHaveBeenCalledWith(true);
      expect(mockGetCurrentBoardValues).toHaveBeenCalled();
      expect(getSuggestion).toHaveBeenCalledWith(mockGetCurrentBoardValues());
    });

    it('calls setLock(false) after getSuggestion resolves', async () => {
      const { getSuggestion } = await import('../../../services/api');
      vi.mocked(getSuggestion).mockResolvedValue({
        recommended: 'LEFT',
        reasoning: 'Try left.',
      });

      const contextValue = createMockContextValue();
      render(
        <GameContext.Provider value={contextValue}>
          <TestHost contextValue={contextValue} />
        </GameContext.Provider>
      );

      screen.getByTestId('on-click').click();

      await vi.waitFor(() => {
        expect(mockSetLock).toHaveBeenLastCalledWith(false);
      });
    });

    it('updates text with recommended and reasoning from API response', async () => {
      const { getSuggestion } = await import('../../../services/api');
      vi.mocked(getSuggestion).mockResolvedValue({
        recommended: 'UP',
        reasoning: 'Moving up is best here.',
      });

      const contextValue = createMockContextValue();
      render(
        <GameContext.Provider value={contextValue}>
          <TestHost contextValue={contextValue} />
        </GameContext.Provider>
      );

      screen.getByTestId('on-click').click();

      await vi.waitFor(() => {
        expect(screen.getByTestId('recommended')).toHaveTextContent('⬆️ Move Up!');
        expect(screen.getByTestId('reasoning')).toHaveTextContent('Moving up is best here.');
        expect(screen.getByTestId('has-response')).toHaveTextContent('true');
      });
    });
  });

  describe('hasMoved effect', () => {
    it('clears response when hasMoved changes', async () => {
      const { getSuggestion } = await import('../../../services/api');
      vi.mocked(getSuggestion).mockResolvedValue({
        recommended: 'UP',
        reasoning: 'Up.',
      });

      const { rerender } = render(
        <GameContext.Provider value={createMockContextValue({ hasMoved: false })}>
          <TestHost contextValue={createMockContextValue()} />
        </GameContext.Provider>
      );

      screen.getByTestId('on-click').click();
      await vi.waitFor(() => {
        expect(screen.getByTestId('has-response')).toHaveTextContent('true');
      });

      rerender(
        <GameContext.Provider value={createMockContextValue({ hasMoved: true })}>
          <TestHost contextValue={createMockContextValue({ hasMoved: true })} />
        </GameContext.Provider>
      );

      await vi.waitFor(() => {
        expect(screen.getByTestId('has-response')).toHaveTextContent('false');
        expect(screen.getByTestId('recommended')).toHaveTextContent('');
      });
    });
  });
});
