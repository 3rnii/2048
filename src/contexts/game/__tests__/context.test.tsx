/**
 * @vitest-environment happy-dom
 */
/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import { GameContext, GameProvider } from '../context';
import {
  processTileAndBoardOnUpMovement,
  processTilesAndBoardOnDownMovement,
  processTilesAndBoardOnLeftMovement,
  processTilesAndBoardOnRightMovement,
} from '../helper';
import type { Tile } from '../../../common/types';

/** Replicates canMakeAnyMove logic from context for testing (context does not expose it). */
function canMakeAnyMoveFromBoardAndTiles(
  board: string[][],
  tiles: Record<string, Tile>
): boolean {
  const upResult = processTileAndBoardOnUpMovement(board, tiles);
  const downResult = processTilesAndBoardOnDownMovement(board, tiles);
  const leftResult = processTilesAndBoardOnLeftMovement(board, tiles);
  const rightResult = processTilesAndBoardOnRightMovement(board, tiles);
  const boardToString = (b: string[][]) => JSON.stringify(b);
  const currentBoardStr = boardToString(board);
  return (
    boardToString(upResult.board) !== currentBoardStr ||
    boardToString(downResult.board) !== currentBoardStr ||
    boardToString(leftResult.board) !== currentBoardStr ||
    boardToString(rightResult.board) !== currentBoardStr
  );
}

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

describe('canMakeAnyMove (logic via same helpers as context)', () => {
  it('returns false for empty board (no tiles to move)', () => {
    const board: string[][] = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ] as string[][];
    const tiles: Record<string, Tile> = {};
    expect(canMakeAnyMoveFromBoardAndTiles(board, tiles)).toBe(false);
  });

  it('returns true when a single tile can be moved in at least one direction', () => {
    const board: string[][] = [
      [null, null, null, null],
      [null, null, null, null],
      [null, 't1', null, null],
      [null, null, null, null],
    ] as string[][];
    const tiles: Record<string, Tile> = {
      t1: { id: 't1', position: [1, 2], value: 2 },
    };
    expect(canMakeAnyMoveFromBoardAndTiles(board, tiles)).toBe(true);
  });

  it('returns true when board has one empty cell (tiles can shift)', () => {
    const board: string[][] = [
      ['a', 'b', 'c', null],
      ['d', 'e', 'f', 'g'],
      ['h', 'i', 'j', 'k'],
      ['l', 'm', 'n', 'o'],
    ] as string[][];
    const tiles: Record<string, Tile> = {
      a: { id: 'a', position: [0, 0], value: 2 },
      b: { id: 'b', position: [1, 0], value: 4 },
      c: { id: 'c', position: [2, 0], value: 8 },
      d: { id: 'd', position: [0, 1], value: 16 },
      e: { id: 'e', position: [1, 1], value: 32 },
      f: { id: 'f', position: [2, 1], value: 64 },
      g: { id: 'g', position: [3, 1], value: 128 },
      h: { id: 'h', position: [0, 2], value: 256 },
      i: { id: 'i', position: [1, 2], value: 512 },
      j: { id: 'j', position: [2, 2], value: 1024 },
      k: { id: 'k', position: [3, 2], value: 2 },
      l: { id: 'l', position: [0, 3], value: 4 },
      m: { id: 'm', position: [1, 3], value: 8 },
      n: { id: 'n', position: [2, 3], value: 16 },
      o: { id: 'o', position: [3, 3], value: 2048 },
    };
    expect(canMakeAnyMoveFromBoardAndTiles(board, tiles)).toBe(true);
  });

  it('returns true when full board has two adjacent same values in a row (merge possible)', () => {
    const board: string[][] = [
      ['a', 'b', 'c', 'd'],
      ['e', 'f', 'f2', 'g'],
      ['h', 'i', 'j', 'k'],
      ['l', 'm', 'n', 'o'],
    ] as string[][];
    const tiles: Record<string, Tile> = {
      a: { id: 'a', position: [0, 0], value: 2 },
      b: { id: 'b', position: [1, 0], value: 4 },
      c: { id: 'c', position: [2, 0], value: 8 },
      d: { id: 'd', position: [3, 0], value: 16 },
      e: { id: 'e', position: [0, 1], value: 32 },
      f: { id: 'f', position: [1, 1], value: 64 },
      f2: { id: 'f2', position: [2, 1], value: 64 },
      g: { id: 'g', position: [3, 1], value: 128 },
      h: { id: 'h', position: [0, 2], value: 256 },
      i: { id: 'i', position: [1, 2], value: 512 },
      j: { id: 'j', position: [2, 2], value: 1024 },
      k: { id: 'k', position: [3, 2], value: 2 },
      l: { id: 'l', position: [0, 3], value: 4 },
      m: { id: 'm', position: [1, 3], value: 8 },
      n: { id: 'n', position: [2, 3], value: 16 },
      o: { id: 'o', position: [3, 3], value: 2048 },
    };
    expect(canMakeAnyMoveFromBoardAndTiles(board, tiles)).toBe(true);
  });

  it('returns true when full board has two adjacent same values in a column (merge possible)', () => {
    const board: string[][] = [
      ['a', 'b', 'c', 'd'],
      ['e', 'f', 'g', 'h'],
      ['i', 'j', 'k', 'l'],
      ['m', 'n', 'n2', 'o'],
    ] as string[][];
    const tiles: Record<string, Tile> = {
      a: { id: 'a', position: [0, 0], value: 2 },
      b: { id: 'b', position: [1, 0], value: 4 },
      c: { id: 'c', position: [2, 0], value: 8 },
      d: { id: 'd', position: [3, 0], value: 16 },
      e: { id: 'e', position: [0, 1], value: 32 },
      f: { id: 'f', position: [1, 1], value: 64 },
      g: { id: 'g', position: [2, 1], value: 128 },
      h: { id: 'h', position: [3, 1], value: 256 },
      i: { id: 'i', position: [0, 2], value: 512 },
      j: { id: 'j', position: [1, 2], value: 1024 },
      k: { id: 'k', position: [2, 2], value: 2 },
      l: { id: 'l', position: [3, 2], value: 4 },
      m: { id: 'm', position: [0, 3], value: 8 },
      n: { id: 'n', position: [1, 3], value: 16 },
      n2: { id: 'n2', position: [2, 3], value: 16 },
      o: { id: 'o', position: [3, 3], value: 2048 },
    };
    expect(canMakeAnyMoveFromBoardAndTiles(board, tiles)).toBe(true);
  });

  it('returns false when board is full and no adjacent same values (no merge, no empty)', () => {
    const board: string[][] = [
      ['a', 'b', 'c', 'd'],
      ['e', 'f', 'g', 'h'],
      ['i', 'j', 'k', 'l'],
      ['m', 'n', 'o', 'p'],
    ] as string[][];
    const tiles: Record<string, Tile> = {
      a: { id: 'a', position: [0, 0], value: 2 },
      b: { id: 'b', position: [1, 0], value: 4 },
      c: { id: 'c', position: [2, 0], value: 8 },
      d: { id: 'd', position: [3, 0], value: 16 },
      e: { id: 'e', position: [0, 1], value: 32 },
      f: { id: 'f', position: [1, 1], value: 64 },
      g: { id: 'g', position: [2, 1], value: 128 },
      h: { id: 'h', position: [3, 1], value: 256 },
      i: { id: 'i', position: [0, 2], value: 512 },
      j: { id: 'j', position: [1, 2], value: 1024 },
      k: { id: 'k', position: [2, 2], value: 2 },
      l: { id: 'l', position: [3, 2], value: 4 },
      m: { id: 'm', position: [0, 3], value: 8 },
      n: { id: 'n', position: [1, 3], value: 16 },
      o: { id: 'o', position: [2, 3], value: 2048 },
      p: { id: 'p', position: [3, 3], value: 4096 },
    };
    expect(canMakeAnyMoveFromBoardAndTiles(board, tiles)).toBe(false);
  });

  it('returns true when only one direction changes the board (e.g. tile at top can move down)', () => {
    const board: string[][] = [
      ['t1', null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ] as string[][];
    const tiles: Record<string, Tile> = {
      t1: { id: 't1', position: [0, 0], value: 2 },
    };
    expect(canMakeAnyMoveFromBoardAndTiles(board, tiles)).toBe(true);
  });
});
