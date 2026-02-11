import { describe, it, expect, vi } from 'vitest';
import { gameReducer, initialState } from '../reducer';
import { actions, keys } from '../actions';

vi.mock('nanoid', () => ({
  nanoid: () => 'mock-id-12',
}));

describe('gameReducer', () => {

  describe('initialState', () => {
    it('has empty board, tiles, tilesByIds and gameStatus new', () => {
      expect(initialState.board).toHaveLength(4);
      expect(initialState.board.every((row) => row.length === 4 && row.every((c) => c === null))).toBe(true);
      expect(initialState.tiles).toEqual({});
      expect(initialState.tilesByIds).toEqual([]);
      expect(initialState.gameStatus).toBe('new');
    });
  });

  describe(keys.reset, () => {
    it('returns initialState', () => {
      const stateWithTiles = {
        ...initialState,
        tiles: { x: { id: 'x', position: [0, 0], value: 2 } },
        tilesByIds: ['x'],
      };
      const next = gameReducer(stateWithTiles, actions.reset);
      expect(next).toEqual(initialState);
    });
  });

  describe(keys.createTile, () => {
    it('adds a tile at the given position', () => {
      const action = actions.createTile([1, 2], 4);
      const next = gameReducer(initialState, action);

      expect(next.board[2][1]).toBe('mock-id-12');
      expect(next.tiles['mock-id-12']).toEqual({
        id: 'mock-id-12',
        position: [1, 2],
        value: 4,
      });
      expect(next.tilesByIds).toContain('mock-id-12');
    });
  });

  describe(keys.moveUp, () => {
    it('updates state with processed board and tiles and sets hasMoved', () => {
      const state = {
        ...initialState,
        board: [
          [null, 'a', null, null],
          [null, null, null, null],
          [null, null, null, null],
          [null, null, null, null],
        ],
        tiles: { a: { id: 'a', position: [1, 0], value: 2 } },
        tilesByIds: ['a'],
      };
      const next = gameReducer(state, actions.moveUp);

      expect(next.previousBoard).toEqual(state.board);
      expect(next.hasMoved).toBe(true);
      expect(next.board[0][1]).toBe('a');
      expect(next.tiles['a'].position).toEqual([1, 0]);
    });
  });

  describe(keys.moveDown, () => {
    it('sets previousBoard and hasMoved', () => {
      const state = {
        ...initialState,
        board: [
          ['a', null, null, null],
          [null, null, null, null],
          [null, null, null, null],
          [null, null, null, null],
        ],
        tiles: { a: { id: 'a', position: [0, 0], value: 2 } },
        tilesByIds: ['a'],
      };
      const next = gameReducer(state, actions.moveDown);

      expect(next.previousBoard).toEqual(state.board);
      expect(next.hasMoved).toBe(true);
      expect(next.board[3][0]).toBe('a');
    });
  });

  describe(keys.moveLeft, () => {
    it('processes left movement and sets hasMoved', () => {
      const state = {
        ...initialState,
        board: [
          [null, null, 'a', null],
          [null, null, null, null],
          [null, null, null, null],
          [null, null, null, null],
        ],
        tiles: { a: { id: 'a', position: [2, 0], value: 2 } },
        tilesByIds: ['a'],
      };
      const next = gameReducer(state, actions.moveLeft);

      expect(next.hasMoved).toBe(true);
      expect(next.board[0][0]).toBe('a');
    });
  });

  describe(keys.moveRight, () => {
    it('processes right movement and sets hasMoved', () => {
      const state = {
        ...initialState,
        board: [
          ['a', null, null, null],
          [null, null, null, null],
          [null, null, null, null],
          [null, null, null, null],
        ],
        tiles: { a: { id: 'a', position: [0, 0], value: 2 } },
        tilesByIds: ['a'],
      };
      const next = gameReducer(state, actions.moveRight);

      expect(next.hasMoved).toBe(true);
      expect(next.board[0][3]).toBe('a');
    });
  });

  describe(keys.updateStatus, () => {
    it('updates gameStatus', () => {
      const next = gameReducer(initialState, actions.updateStatus('playing'));
      expect(next.gameStatus).toBe('playing');

      const won = gameReducer(initialState, actions.updateStatus('won'));
      expect(won.gameStatus).toBe('won');
    });
  });

  describe(keys.updateHasMoved, () => {
    it('sets hasMoved to false', () => {
      const state = { ...initialState, hasMoved: true };
      const next = gameReducer(state, actions.hasMoved);
      expect(next.hasMoved).toBe(false);
    });
  });

  describe('unknown action', () => {
    it('returns state unchanged', () => {
      const state = { ...initialState, gameStatus: 'playing' as const };
      const next = gameReducer(state, { type: 'UNKNOWN' as never });
      expect(next).toBe(state);
    });
  });
});
