/**
 * @vitest-environment happy-dom
 */
/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import { GameContext } from '../../../contexts/game/context';
import useViewModel from '../Board.viewModel';

const mockMove = vi.fn();
const mockResetGame = vi.fn();
const mockGetTileAtPosition = vi.fn();
const mockStartGame = vi.fn();

function createMockContextValue(overrides: Record<string, unknown> = {}) {
  return {
    startGame: mockStartGame,
    getTiles: () => [],
    getTileAtPosition: mockGetTileAtPosition,
    getCurrentBoardValues: () => [] as (number | null)[][],
    hasMoved: false,
    move: mockMove,
    status: 'new' as const,
    resetGame: mockResetGame,
    setLock: vi.fn(),
    isLocked: false,
    ...overrides,
  };
}

function TestHost({ contextValue: _contextValue }: { contextValue: ReturnType<typeof createMockContextValue> }) {
  const vm = useViewModel();
  return (
    <div data-testid="vm-host">
      {vm.renderTiles?.()}
    </div>
  );
}

describe('Board viewModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTileAtPosition.mockReturnValue(undefined);
    cleanup();
  });

  describe('renderTiles', () => {
    it('calls getTileAtPosition 16 times with correct [col, row] for each cell', () => {
      const contextValue = createMockContextValue();
      render(
        <GameContext.Provider value={contextValue}>
          <TestHost contextValue={contextValue} />
        </GameContext.Provider>
      );

      expect(mockGetTileAtPosition).toHaveBeenCalledTimes(16);
      expect(mockGetTileAtPosition).toHaveBeenNthCalledWith(1, [0, 0]);
      expect(mockGetTileAtPosition).toHaveBeenNthCalledWith(2, [1, 0]);
      expect(mockGetTileAtPosition).toHaveBeenNthCalledWith(5, [0, 1]);
      expect(mockGetTileAtPosition).toHaveBeenNthCalledWith(6, [1, 1]);
      expect(mockGetTileAtPosition).toHaveBeenNthCalledWith(16, [3, 3]);
    });

    it('renders 16 tile cells with expected styling', () => {
      const contextValue = createMockContextValue();
      render(
        <GameContext.Provider value={contextValue}>
          <TestHost contextValue={contextValue} />
        </GameContext.Provider>
      );

      const host = screen.getByTestId('vm-host');
      const tileCells = host.querySelectorAll('.aspect-square');
      expect(tileCells.length).toBe(16);
      expect(tileCells[0]).toHaveClass('bg-gray-200');
      expect(tileCells[0]).toHaveClass('rounded');
    });
  });

  describe('handleKeyDown', () => {
    it('calls move("up") when ArrowUp is pressed and game is playing', () => {
      const contextValue = createMockContextValue({ status: 'playing', isLocked: false });
      render(
        <GameContext.Provider value={contextValue}>
          <TestHost contextValue={contextValue} />
        </GameContext.Provider>
      );

      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', bubbles: true }));

      expect(mockMove).toHaveBeenCalledWith('up');
    });

    it('calls move("down") when ArrowDown is pressed', () => {
      const contextValue = createMockContextValue({ status: 'playing', isLocked: false });
      render(
        <GameContext.Provider value={contextValue}>
          <TestHost contextValue={contextValue} />
        </GameContext.Provider>
      );

      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', bubbles: true }));

      expect(mockMove).toHaveBeenCalledWith('down');
    });

    it('calls move("left") when ArrowLeft is pressed', () => {
      const contextValue = createMockContextValue({ status: 'playing', isLocked: false });
      render(
        <GameContext.Provider value={contextValue}>
          <TestHost contextValue={contextValue} />
        </GameContext.Provider>
      );

      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowLeft', bubbles: true }));

      expect(mockMove).toHaveBeenCalledWith('left');
    });

    it('calls move("right") when ArrowRight is pressed', () => {
      const contextValue = createMockContextValue({ status: 'playing', isLocked: false });
      render(
        <GameContext.Provider value={contextValue}>
          <TestHost contextValue={contextValue} />
        </GameContext.Provider>
      );

      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight', bubbles: true }));

      expect(mockMove).toHaveBeenCalledWith('right');
    });

    it('calls move("up") when KeyW is pressed', () => {
      const contextValue = createMockContextValue({ status: 'playing', isLocked: false });
      render(
        <GameContext.Provider value={contextValue}>
          <TestHost contextValue={contextValue} />
        </GameContext.Provider>
      );

      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyW', bubbles: true }));

      expect(mockMove).toHaveBeenCalledWith('up');
    });

    it('calls resetGame when status is won and Space is pressed', () => {
      const contextValue = createMockContextValue({ status: 'won', isLocked: false });
      render(
        <GameContext.Provider value={contextValue}>
          <TestHost contextValue={contextValue} />
        </GameContext.Provider>
      );

      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }));

      expect(mockResetGame).toHaveBeenCalled();
      expect(mockMove).not.toHaveBeenCalled();
    });

    it('calls resetGame when status is lost and Enter is pressed', () => {
      const contextValue = createMockContextValue({ status: 'lost', isLocked: false });
      render(
        <GameContext.Provider value={contextValue}>
          <TestHost contextValue={contextValue} />
        </GameContext.Provider>
      );

      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter', bubbles: true }));

      expect(mockResetGame).toHaveBeenCalled();
    });

    it('does not call move or resetGame when isLocked is true', () => {
      const contextValue = createMockContextValue({ status: 'playing', isLocked: true });
      render(
        <GameContext.Provider value={contextValue}>
          <TestHost contextValue={contextValue} />
        </GameContext.Provider>
      );

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', bubbles: true }));
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }));
      });

      expect(mockMove).not.toHaveBeenCalled();
      expect(mockResetGame).not.toHaveBeenCalled();
    });

    it('does not call move when status is won and ArrowUp is pressed', () => {
      const contextValue = createMockContextValue({ status: 'won', isLocked: false });
      render(
        <GameContext.Provider value={contextValue}>
          <TestHost contextValue={contextValue} />
        </GameContext.Provider>
      );

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', bubbles: true }));
      });

      expect(mockMove).not.toHaveBeenCalled();
    });
  });
});
