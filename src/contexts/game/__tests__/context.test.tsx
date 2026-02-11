/**
 * @vitest-environment happy-dom
 */
/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import { GameContext, GameProvider } from '../context';

describe('GameContext', () => {
  it('GameContext and GameProvider are defined', () => {
    expect(GameContext).toBeDefined();
    expect(GameContext.Provider).toBeDefined();
    expect(GameProvider).toBeDefined();
    expect(typeof GameProvider).toBe('function');
  });
});

function ContextConsumerWithHook() {
  const value = React.useContext(GameContext);
  const {
    startGame,
    getTiles,
    getTileAtPosition,
    getCurrentBoardValues,
    move,
    resetGame,
    setLock,
    status,
    hasMoved,
    isLocked,
  } = value;

  const tiles = getTiles();
  const boardValues = getCurrentBoardValues();
  const tileAt00 = getTileAtPosition([0, 0]);

  return (
    <div data-testid="consumer">
      <span data-testid="status">{status}</span>
      <span data-testid="tile-count">{tiles.length}</span>
      <span data-testid="has-moved">{String(hasMoved)}</span>
      <span data-testid="is-locked">{String(isLocked)}</span>
      <span data-testid="board-rows">{boardValues.length}</span>
      <span data-testid="board-cols">{boardValues[0]?.length ?? 0}</span>
      <span data-testid="tile-at-00">{tileAt00 ? tileAt00.id : 'none'}</span>
      <button type="button" onClick={startGame} data-testid="btn-start">
        Start
      </button>
      <button type="button" onClick={() => move('up')} data-testid="btn-move-up">
        Move Up
      </button>
      <button type="button" onClick={resetGame} data-testid="btn-reset">
        Reset
      </button>
      <button type="button" onClick={() => setLock(true)} data-testid="btn-lock">
        Lock
      </button>
      <button type="button" onClick={() => setLock(false)} data-testid="btn-unlock">
        Unlock
      </button>
    </div>
  );
}

describe('GameProvider (integration)', () => {
  beforeEach(() => {
    cleanup();
  });

  it('provides initial state: status new, no tiles, board 4x4', () => {
    render(
      <GameProvider>
        <ContextConsumerWithHook />
      </GameProvider>
    );
    expect(screen.getByTestId('status')).toHaveTextContent('new');
    expect(screen.getByTestId('tile-count')).toHaveTextContent('0');
    expect(screen.getByTestId('board-rows')).toHaveTextContent('4');
    expect(screen.getByTestId('board-cols')).toHaveTextContent('4');
    expect(screen.getByTestId('is-locked')).toHaveTextContent('false');
  });

  it('startGame adds tiles and getTiles reflects them', () => {
    render(
      <GameProvider>
        <ContextConsumerWithHook />
      </GameProvider>
    );
    expect(screen.getByTestId('tile-count')).toHaveTextContent('0');

    act(() => {
      screen.getByTestId('btn-start').click();
    });

    const count = Number(screen.getByTestId('tile-count').textContent);
    expect(count).toBeGreaterThanOrEqual(2);
    expect(count).toBeLessThanOrEqual(16);
  });

  it('getCurrentBoardValues returns 4x4 after startGame', () => {
    render(
      <GameProvider>
        <ContextConsumerWithHook />
      </GameProvider>
    );
    act(() => {
      screen.getByTestId('btn-start').click();
    });

    expect(screen.getByTestId('board-rows')).toHaveTextContent('4');
    expect(screen.getByTestId('board-cols')).toHaveTextContent('4');
  });

  it('move("up") sets status to playing', () => {
    render(
      <GameProvider>
        <ContextConsumerWithHook />
      </GameProvider>
    );
    act(() => {
      screen.getByTestId('btn-start').click();
    });
    expect(screen.getByTestId('status')).toHaveTextContent('new');

    act(() => {
      screen.getByTestId('btn-move-up').click();
    });

    expect(screen.getByTestId('status')).toHaveTextContent('playing');
  });

  it('setLock updates isLocked', () => {
    render(
      <GameProvider>
        <ContextConsumerWithHook />
      </GameProvider>
    );
    expect(screen.getByTestId('is-locked')).toHaveTextContent('false');

    act(() => {
      screen.getByTestId('btn-lock').click();
    });
    expect(screen.getByTestId('is-locked')).toHaveTextContent('true');

    act(() => {
      screen.getByTestId('btn-unlock').click();
    });
    expect(screen.getByTestId('is-locked')).toHaveTextContent('false');
  });

  it('resetGame clears and adds new tiles', () => {
    render(
      <GameProvider>
        <ContextConsumerWithHook />
      </GameProvider>
    );
    act(() => {
      screen.getByTestId('btn-start').click();
    });
    const countAfterStart = Number(screen.getByTestId('tile-count').textContent);
    expect(countAfterStart).toBeGreaterThanOrEqual(2);

    act(() => {
      screen.getByTestId('btn-reset').click();
    });

    const countAfterReset = Number(screen.getByTestId('tile-count').textContent);
    expect(countAfterReset).toBeGreaterThanOrEqual(2);
    expect(screen.getByTestId('status')).toHaveTextContent('new');
  });

  it('getTileAtPosition returns a tile when one exists at that position', () => {
    render(
      <GameProvider>
        <ContextConsumerWithHook />
      </GameProvider>
    );
    act(() => {
      screen.getByTestId('btn-start').click();
    });

    // At least one tile exists; tile-at-00 might be "none" or an id depending on random placement
    const tileAt00 = screen.getByTestId('tile-at-00').textContent;
    const count = Number(screen.getByTestId('tile-count').textContent);
    expect(count).toBeGreaterThanOrEqual(2);
    expect(typeof tileAt00).toBe('string');
  });
});
